import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from './entities/guide.entity';
import {
  CompleteGuideProfileDto,
  UpdateGuideSpecialtiesDto,
  UpdateGuideExperienceDto,
} from './dto/guide.dto';
import { GuideMongoService } from './guide-mongo.service';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(Guide)
    private readonly repo: Repository<Guide>,
    private readonly mongoService: GuideMongoService,
  ) {}

  async getProfile(userId: string) {
    const [sqlProfile, mongoSkills, mongoEngagement] = await Promise.all([
      this.repo.findOne({ where: { user_id: userId } }),
      this.mongoService.getSkills(userId),
      this.mongoService.getEngagement(userId),
    ]);

    if (sqlProfile) {
      const freshCompletion = this.calculateCompletion(sqlProfile);
      if (freshCompletion !== sqlProfile.profile_completion) {
        sqlProfile.profile_completion = freshCompletion;
        await this.repo.save(sqlProfile);
      }
    }

    return {
      user_id: sqlProfile?.user_id,
      full_name: sqlProfile?.full_name,
      guide_type: sqlProfile?.guide_type,
      bio: sqlProfile?.bio,
      country: sqlProfile?.country,
      language: sqlProfile?.language,
      photo: sqlProfile?.photo,
      zone: sqlProfile?.zone,
      specialties: sqlProfile?.specialties,
      languages_spoken: sqlProfile?.languages_spoken,
      years_experience: sqlProfile?.years_experience,
      status: sqlProfile?.status,
      sustainability_score: sqlProfile?.sustainability_score,
      score_reservations: sqlProfile?.score_reservations ?? 0,
      score_feedbacks: sqlProfile?.score_feedbacks ?? 0,
      profile_completion: sqlProfile?.profile_completion,
      is_onboarded: sqlProfile?.is_onboarded,
      // MongoDB
      skills_activities: mongoSkills?.activities ?? [],
      skills_landscapes: mongoSkills?.landscapes ?? [],
      certifications: mongoSkills?.certifications ?? [],
      badges: mongoEngagement?.badges ?? [],
      feedback_received: mongoEngagement?.feedback_received ?? 0,
      reservations_handled: mongoEngagement?.reservations_handled ?? 0,
    };
  }

  async completeProfile(userId: string, dto: CompleteGuideProfileDto) {
    let profile = await this.repo.findOne({ where: { user_id: userId } });

    if (!profile) {
      profile = this.repo.create({ user_id: userId });
      await this.mongoService.initEngagement(userId);
    }

    profile.full_name = dto.full_name;
    profile.guide_type = dto.guide_type ?? null;
    profile.bio = dto.bio ?? null;
    profile.country = dto.country ?? null;
    profile.language = dto.language ?? null;
    profile.photo = dto.photo ?? null;
    profile.zone = dto.zone ?? null;
    profile.profile_completion = this.calculateCompletion(profile);

    return await this.repo.save(profile);
  }

  async updateSpecialties(userId: string, dto: UpdateGuideSpecialtiesDto) {
    const profile = await this.findOrFail(userId);
    profile.specialties = dto.specialties;
    profile.languages_spoken = dto.languages_spoken;
    profile.profile_completion = this.calculateCompletion(profile);

    const saved = await this.repo.save(profile);
    await this.mongoService.upsertSkills(userId, { activities: dto.specialties });

    return saved;
  }

  async updateExperience(userId: string, dto: UpdateGuideExperienceDto) {
    const profile = await this.findOrFail(userId);
    profile.years_experience = dto.years_experience;
    profile.profile_completion = this.calculateCompletion(profile);

    const saved = await this.repo.save(profile);
    await this.mongoService.upsertSkills(userId, {
      landscapes: dto.landscapes,
      certifications: dto.certifications,
    });

    return saved;
  }

  async markOnboarded(userId: string) {
    const profile = await this.findOrFail(userId);
    profile.is_onboarded = true;

    const saved = await this.repo.save(profile);
    await this.mongoService.addBadge(userId, 'Guide Éco-Certifié');

    return saved;
  }

  async updateQuestionnaireScore(userId: string, scoreQuestionnaire: number) {
    const profile = await this.findOrFail(userId);
    profile.score_questionnaire = scoreQuestionnaire;
    profile.sustainability_score = Math.round(
      scoreQuestionnaire * 0.40 + profile.score_reservations * 0.40 + profile.score_feedbacks * 0.20,
    );
    const saved = await this.repo.save(profile);
    await this.mongoService.updateScore(userId, profile.sustainability_score);
    if (profile.sustainability_score >= 80) {
      await this.mongoService.addBadge(userId, 'Guide Ambassadeur AFRATIM');
    }
    return saved;
  }

  private async findOrFail(userId: string) {
    const profile = await this.repo.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new NotFoundException("Profil introuvable. Complétez d'abord votre profil de base.");
    }
    return profile;
  }

  private calculateCompletion(p: Partial<Guide>): number {
    let score = 0;

    const identityFields = [p.full_name, p.country, p.language];
    score += (identityFields.filter(Boolean).length / identityFields.length) * 30;

    if (p.guide_type) score += 10;
    if (p.zone) score += 10;
    if (p.specialties?.length) score += 15;
    if (p.languages_spoken?.length) score += 10;
    if (p.years_experience !== null && p.years_experience !== undefined) score += 15;
    if (p.photo) score += 10;

    return Math.round(score);
  }
}
