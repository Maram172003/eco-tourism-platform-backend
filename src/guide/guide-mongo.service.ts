import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GuideSkills, GuideSkillsDocument } from './schemas/guide-skills.schema';
import { GuideEngagement, GuideEngagementDocument } from './schemas/guide-engagement.schema';

@Injectable()
export class GuideMongoService {
  constructor(
    @InjectModel(GuideSkills.name)
    private readonly skillsModel: Model<GuideSkillsDocument>,

    @InjectModel(GuideEngagement.name)
    private readonly engagementModel: Model<GuideEngagementDocument>,
  ) {}

  async getSkills(userId: string) {
    return await this.skillsModel.findOne({ user_id: userId });
  }

  async upsertSkills(userId: string, data: Partial<GuideSkills>) {
    return await this.skillsModel.findOneAndUpdate(
      { user_id: userId },
      { $set: data },
      { upsert: true, new: true },
    );
  }

  async getEngagement(userId: string) {
    return await this.engagementModel.findOne({ user_id: userId });
  }

  async initEngagement(userId: string) {
    const existing = await this.engagementModel.findOne({ user_id: userId });
    if (existing) return existing;

    return await this.engagementModel.create({
      user_id: userId,
      durability_score: 0,
      badges: [],
      feedback_received: 0,
      reservations_handled: 0,
    });
  }

  async updateScore(userId: string, score: number) {
    return await this.engagementModel.findOneAndUpdate(
      { user_id: userId },
      { $set: { durability_score: score } },
      { upsert: true, new: true },
    );
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
}
