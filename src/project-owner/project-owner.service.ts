import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectOwner } from './entities/project-owner.entity';
import { Project } from './entities/project.entity';
import { CompleteOwnerProfileDto } from './dto/project-owner.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectOwnerMongoService } from './project-owner-mongo.service';

@Injectable()
export class ProjectOwnerService {
  constructor(
    @InjectRepository(ProjectOwner)
    private readonly ownerRepo: Repository<ProjectOwner>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    private readonly mongoService: ProjectOwnerMongoService,
  ) {}

  // ─── Owner Profile ────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const [sqlProfile, mongoEngagement] = await Promise.all([
      this.ownerRepo.findOne({ where: { user_id: userId } }),
      this.mongoService.getEngagement(userId),
    ]);

    if (sqlProfile) {
      const freshCompletion = this.calculateCompletion(sqlProfile);
      if (freshCompletion !== sqlProfile.profile_completion) {
        sqlProfile.profile_completion = freshCompletion;
        await this.ownerRepo.save(sqlProfile);
      }
    }

    const projects = await this.projectRepo.find({ where: { owner_id: userId } });

    return {
      user_id: sqlProfile?.user_id,
      full_name: sqlProfile?.full_name,
      bio: sqlProfile?.bio,
      country: sqlProfile?.country,
      language: sqlProfile?.language,
      photo: sqlProfile?.photo,
      organization: sqlProfile?.organization,
      position: sqlProfile?.position,
      phone: sqlProfile?.phone,
      profile_completion: sqlProfile?.profile_completion,
      is_onboarded: sqlProfile?.is_onboarded,
      // MongoDB
      badges: mongoEngagement?.badges ?? [],
      total_reservations: mongoEngagement?.total_reservations ?? 0,
      feedback_received: mongoEngagement?.feedback_received ?? 0,
      projects_count: mongoEngagement?.projects_count ?? 0,
      // Projects
      projects,
    };
  }

  async completeProfile(userId: string, dto: CompleteOwnerProfileDto) {
    let profile = await this.ownerRepo.findOne({ where: { user_id: userId } });

    if (!profile) {
      profile = this.ownerRepo.create({ user_id: userId });
      await this.mongoService.initEngagement(userId);
    }

    profile.full_name = dto.full_name;
    profile.bio = dto.bio ?? null;
    profile.country = dto.country ?? null;
    profile.language = dto.language ?? null;
    profile.photo = dto.photo ?? null;
    profile.organization = dto.organization ?? null;
    profile.position = dto.position ?? null;
    profile.phone = dto.phone ?? null;
    profile.profile_completion = this.calculateCompletion(profile);

    return await this.ownerRepo.save(profile);
  }

  async markOnboarded(userId: string) {
    const profile = await this.findOwnerOrFail(userId);
    profile.is_onboarded = true;

    const saved = await this.ownerRepo.save(profile);
    await this.mongoService.addBadge(userId, 'Propriétaire Éco-Engagé');

    return saved;
  }

  // ─── Projects ─────────────────────────────────────────────────────────────

  async getProjects(userId: string) {
    return await this.projectRepo.find({ where: { owner_id: userId } });
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    await this.findOwnerOrFail(userId);

    const project = this.projectRepo.create({
      owner_id: userId,
      name: dto.name,
      project_type: dto.project_type ?? null,
      description: dto.description ?? null,
      region: dto.region ?? null,
      address: dto.address ?? null,
      photo: dto.photo ?? null,
      services: dto.services ?? null,
      eco_labels: dto.eco_labels ?? null,
      website: dto.website ?? null,
      phone: dto.phone ?? null,
    });

    const saved = await this.projectRepo.save(project);

    await this.mongoService.incrementProjectsCount(userId);

    if (dto.services?.length) {
      await this.mongoService.upsertProjectServices(saved.id, userId, {
        offered_services: dto.services,
        eco_practices: dto.eco_labels ?? [],
      });
    }

    return saved;
  }

  async updateProject(userId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });

    if (!project) throw new NotFoundException('Projet introuvable.');
    if (project.owner_id !== userId) throw new ForbiddenException('Accès refusé.');

    if (dto.name !== undefined) project.name = dto.name;
    if (dto.project_type !== undefined) project.project_type = dto.project_type;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.region !== undefined) project.region = dto.region;
    if (dto.address !== undefined) project.address = dto.address;
    if (dto.photo !== undefined) project.photo = dto.photo;
    if (dto.services !== undefined) project.services = dto.services;
    if (dto.eco_labels !== undefined) project.eco_labels = dto.eco_labels;
    if (dto.website !== undefined) project.website = dto.website;
    if (dto.phone !== undefined) project.phone = dto.phone;

    const saved = await this.projectRepo.save(project);

    if (dto.services?.length || dto.eco_labels?.length) {
      await this.mongoService.upsertProjectServices(projectId, userId, {
        offered_services: dto.services ?? project.services ?? [],
        eco_practices: dto.eco_labels ?? project.eco_labels ?? [],
      });
    }

    return saved;
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });

    if (!project) throw new NotFoundException('Projet introuvable.');
    if (project.owner_id !== userId) throw new ForbiddenException('Accès refusé.');

    await this.projectRepo.remove(project);

    return { message: 'Projet supprimé avec succès.' };
  }

  async updateQuestionnaireScore(userId: string, scoreQuestionnaire: number) {
    const profile = await this.findOwnerOrFail(userId);
    profile.score_questionnaire = scoreQuestionnaire;
    profile.sustainability_score = Math.round(
      scoreQuestionnaire * 0.40 + profile.score_reservations * 0.40 + profile.score_feedbacks * 0.20,
    );
    const saved = await this.ownerRepo.save(profile);
    if (profile.sustainability_score >= 80) {
      await this.mongoService.addBadge(userId, 'Propriétaire Ambassadeur AFRATIM');
    }
    return saved;
  }

  private async findOwnerOrFail(userId: string) {
    const profile = await this.ownerRepo.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new NotFoundException("Profil introuvable. Complétez d'abord votre profil.");
    }
    return profile;
  }

  private calculateCompletion(p: Partial<ProjectOwner>): number {
    let score = 0;

    const identityFields = [p.full_name, p.country, p.language];
    score += (identityFields.filter(Boolean).length / identityFields.length) * 30;

    if (p.organization) score += 20;
    if (p.position) score += 15;
    if (p.bio) score += 15;
    if (p.phone) score += 10;
    if (p.photo) score += 10;

    return Math.round(score);
  }
}
