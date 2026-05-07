import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EcoTraveler } from './entities/eco-traveler.entity';
import {
  CompleteProfileDto,
  UpdateGoalsDto,
  UpdateInterestsDto,
  UpdateMotivationsDto,
  UpdateTravelerTypesDto,
} from './dto/eco-traveler.dto';
import { EcoTravelerMongoService } from './eco-traveler-mongo.service';

@Injectable()
export class EcoTravelerService {
  constructor(
    @InjectRepository(EcoTraveler)
    private readonly repo: Repository<EcoTraveler>,
    private readonly mongoService: EcoTravelerMongoService,
  ) { }

  async getProfile(userId: string) {
    // Les 3 requêtes partent en parallèle
    const [sqlProfile, mongoPrefs, mongoEngagement] = await Promise.all([
      this.repo.findOne({ where: { user_id: userId } }),
      this.mongoService.getPreferences(userId),
      this.mongoService.getEngagement(userId),
    ]);

    // Recalcule et sauvegarde la completion si elle a changé
    if (sqlProfile) {
      const freshCompletion = this.calculateCompletion(sqlProfile);
      if (freshCompletion !== sqlProfile.profile_completion) {
        sqlProfile.profile_completion = freshCompletion;
        await this.repo.save(sqlProfile);
      }
    }

    return {
      // ── PostgreSQL : source de vérité ──────────────────────────────
      user_id: sqlProfile?.user_id,
      full_name: sqlProfile?.full_name,
      bio: sqlProfile?.bio,
      country: sqlProfile?.country,
      language: sqlProfile?.language,
      photo: sqlProfile?.photo,
      traveler_types: sqlProfile?.traveler_types,
      motivations: sqlProfile?.motivations,
      sustainability_values: sqlProfile?.sustainability_values,
      interests: sqlProfile?.interests,
      landscapes: sqlProfile?.landscapes,
      travel_styles: sqlProfile?.travel_styles,
      sustainability_goals: sqlProfile?.sustainability_goals,
      sustainability_score: sqlProfile?.sustainability_score,
      score_questionnaire: sqlProfile?.score_questionnaire ?? null,
      score_reservations: sqlProfile?.score_reservations ?? 0,
      score_feedbacks: sqlProfile?.score_feedbacks ?? 0,
      score_partages: sqlProfile?.score_partages ?? 0,
      profile_completion: sqlProfile?.profile_completion,
      is_onboarded: sqlProfile?.is_onboarded,

      // ── MongoDB preferences : unique à cette source ─────────────────
      // (interests/landscapes/motivations/goals déjà dans SQL → pas répétés)
      updated_by_behavior: mongoPrefs?.updated_by_behavior ?? false,

      // ── MongoDB engagement : unique à cette source ──────────────────
      // (durability_score déjà dans SQL comme sustainability_score → pas répété)
      badges: mongoEngagement?.badges ?? [],
      feedback_given: mongoEngagement?.feedback_given ?? 0,
      plans_shared: mongoEngagement?.plans_shared ?? 0,
      reservations_made: mongoEngagement?.reservations_made ?? 0,
    };
  }

  async completeProfile(userId: string, dto: CompleteProfileDto) {
    let profile = await this.repo.findOne({ where: { user_id: userId } });

    if (!profile) {
      profile = this.repo.create({ user_id: userId });
      await this.mongoService.initEngagement(userId);
    }

    profile.full_name = dto.full_name;
    profile.bio = dto.bio ?? null;
    profile.country = dto.country ?? null;
    profile.language = dto.language ?? null;
    profile.photo = dto.photo ?? null;
    profile.profile_completion = this.calculateCompletion(profile);

    return await this.repo.save(profile);
  }

  async updateTravelerTypes(userId: string, dto: UpdateTravelerTypesDto) {
    const profile = await this.findOrFail(userId);
    profile.traveler_types = dto.traveler_types;
    profile.profile_completion = this.calculateCompletion(profile);

    return await this.repo.save(profile);
  }

  async updateMotivations(userId: string, dto: UpdateMotivationsDto) {
    const profile = await this.findOrFail(userId);
    profile.motivations = dto.motivations;
    profile.sustainability_values = dto.sustainability_values;
    profile.profile_completion = this.calculateCompletion(profile);

    const saved = await this.repo.save(profile);

    await this.mongoService.syncPreferencesFromProfile(userId, {
      motivations: dto.motivations,
    });

    return saved;
  }

  async updateInterests(userId: string, dto: UpdateInterestsDto) {
    const profile = await this.findOrFail(userId);
    profile.interests = dto.interests;
    profile.landscapes = dto.landscapes;
    profile.travel_styles = dto.travel_styles;
    profile.profile_completion = this.calculateCompletion(profile);

    const saved = await this.repo.save(profile);

    await this.mongoService.syncPreferencesFromProfile(userId, {
      interests: dto.interests,
      landscapes: dto.landscapes,
    });

    return saved;
  }

  async updateGoals(userId: string, dto: UpdateGoalsDto) {
    const profile = await this.findOrFail(userId);
    profile.sustainability_goals = dto.sustainability_goals;
    profile.profile_completion = this.calculateCompletion(profile);

    const saved = await this.repo.save(profile);

    await this.mongoService.syncPreferencesFromProfile(userId, {
      sustainability_goals: dto.sustainability_goals,
    });

    return saved;
  }
  //badges
  async markOnboarded(userId: string) {
    const profile = await this.findOrFail(userId);
    profile.is_onboarded = true;

    const saved = await this.repo.save(profile);
    await this.mongoService.addBadge(userId, 'Explorateur Durable');

    return saved;
  }

  /**
  * Appelé après le questionnaire.
  * Stocke le score brut du QCM puis recalcule le score final pondéré.
  *
  * Formule spec AFRATIM :
  *   score_final = (questionnaire * 20%)
  *               + (reservations  * 40%)   ← Sprint 4
  *               + (feedbacks     * 20%)   ← Sprint 8
  *               + (partages      * 20%)   ← Sprint 7
  */
  async updateQuestionnaireScore(userId: string, scoreQuestionnaire: number) {
    const profile = await this.findOrFail(userId);

    // Sauvegarder le composant questionnaire
    profile.score_questionnaire = scoreQuestionnaire;

    // Recalculer le score final avec la pondération
    profile.sustainability_score = this.calculateFinalScore(profile);

    const saved = await this.repo.save(profile);

    // Synchroniser dans MongoDB
    await this.mongoService.updateScore(userId, profile.sustainability_score);

    // Badge ambassadeur si score final >= 80
    if (profile.sustainability_score >= 80) {
      await this.mongoService.addBadge(userId, 'Ambassadeur ');
    }

    return saved;
  }

  /**
   * Appelé aux Sprints 4, 7, 8 pour mettre à jour les autres composants.
   */
  async updateScoreComponent(
    userId: string,
    component: 'reservations' | 'feedbacks' | 'partages',
    value: number,
   ) {
    const profile = await this.findOrFail(userId);

    if (component === 'reservations') profile.score_reservations = value;
    if (component === 'feedbacks') profile.score_feedbacks = value;
    if (component === 'partages') profile.score_partages = value;

    profile.sustainability_score = this.calculateFinalScore(profile);

    const saved = await this.repo.save(profile);
    await this.mongoService.updateScore(userId, profile.sustainability_score);

    if (profile.sustainability_score >= 80) {
      await this.mongoService.addBadge(userId, 'Ambassadeur AFRATIM');
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

  /**
   * Score final pondéré selon la spec AFRATIM :
   *   Questionnaire  20%
   *   Réservations   40%
   *   Feedbacks      20%
   *   Partages       20%
   */
  private calculateFinalScore(p: Partial<EcoTraveler>): number {
    const q = p.score_questionnaire ?? 0;  // 20%
    const r = p.score_reservations ?? 0;  // 40%
    const f = p.score_feedbacks ?? 0;  // 20%
    const s = p.score_partages ?? 0;  // 20%

    return Math.round(q * 0.20 + r * 0.40 + f * 0.20 + s * 0.20);
  }

  /**
   * Completion % du profil  :
   *   Identité 30% | Profil voyageur 20% | Intérêts 15%
   *   Préférences 15% | Objectifs 10% | Photo 10%
   */
  private calculateCompletion(p: Partial<EcoTraveler>): number {
    let score = 0;

    const identityFields = [p.full_name, p.country, p.language];
    score += (identityFields.filter(Boolean).length / identityFields.length) * 30;

    if (p.traveler_types?.length) score += 10;
    if (p.motivations?.length || p.sustainability_values?.length) score += 10;
    if (p.interests?.length) score += 15;
    if (p.landscapes?.length) score += 8;
    if (p.travel_styles?.length) score += 7;
    if (p.sustainability_goals?.length) score += 10;
    if (p.photo) score += 10;

    return Math.round(score);
  }
}