import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectEngagement, ProjectEngagementDocument } from './schemas/project-engagement.schema';
import { ProjectServices, ProjectServicesDocument } from './schemas/project-services.schema';

@Injectable()
export class ProjectOwnerMongoService {
  constructor(
    @InjectModel(ProjectEngagement.name)
    private readonly engagementModel: Model<ProjectEngagementDocument>,

    @InjectModel(ProjectServices.name)
    private readonly servicesModel: Model<ProjectServicesDocument>,
  ) {}

  async getEngagement(userId: string) {
    return await this.engagementModel.findOne({ user_id: userId });
  }

  async initEngagement(userId: string) {
    const existing = await this.engagementModel.findOne({ user_id: userId });
    if (existing) return existing;

    return await this.engagementModel.create({
      user_id: userId,
      sustainability_score: 0,
      badges: [],
      total_reservations: 0,
      feedback_received: 0,
      projects_count: 0,
    });
  }

  async addBadge(userId: string, label: string) {
    const existing = await this.engagementModel.findOne({
      user_id: userId,
      'badges.label': label,
    });
    if (existing) return existing;

    return await this.engagementModel.findOneAndUpdate(
      { user_id: userId },
      { $push: { badges: { label, obtained_at: new Date() } } },
      { upsert: true, new: true },
    );
  }

  async incrementProjectsCount(userId: string) {
    return await this.engagementModel.findOneAndUpdate(
      { user_id: userId },
      { $inc: { projects_count: 1 } },
      { upsert: true, new: true },
    );
  }

  async upsertProjectServices(projectId: string, ownerId: string, data: Partial<ProjectServices>) {
    return await this.servicesModel.findOneAndUpdate(
      { project_id: projectId },
      { $set: { ...data, project_id: projectId, owner_id: ownerId } },
      { upsert: true, new: true },
    );
  }

  async getProjectServices(projectId: string) {
    return await this.servicesModel.findOne({ project_id: projectId });
  }
}
