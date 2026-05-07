import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuideEngagementDocument = GuideEngagement & Document;

@Schema({ collection: 'guide_engagement', timestamps: true })
export class GuideEngagement {
  @Prop({ required: true, index: true })
  user_id!: string;

  @Prop({ default: 0 })
  durability_score!: number;

  @Prop({
    type: [{ label: String, obtained_at: Date }],
    default: [],
  })
  badges!: { label: string; obtained_at: Date }[];

  @Prop({ default: 0 })
  feedback_received!: number;

  @Prop({ default: 0 })
  reservations_handled!: number;
}

export const GuideEngagementSchema = SchemaFactory.createForClass(GuideEngagement);
