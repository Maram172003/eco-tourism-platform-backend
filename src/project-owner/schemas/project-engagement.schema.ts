import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectEngagementDocument = ProjectEngagement & Document;

@Schema({ collection: 'project_engagement', timestamps: true })
export class ProjectEngagement {
  @Prop({ required: true, index: true })
  user_id!: string;

  @Prop({ default: 0 })
  sustainability_score!: number;

  @Prop({
    type: [{ label: String, obtained_at: Date }],
    default: [],
  })
  badges!: { label: string; obtained_at: Date }[];

  @Prop({ default: 0 })
  total_reservations!: number;

  @Prop({ default: 0 })
  feedback_received!: number;

  @Prop({ default: 0 })
  projects_count!: number;
}

export const ProjectEngagementSchema = SchemaFactory.createForClass(ProjectEngagement);
