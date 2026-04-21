import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelerEngagementDocument = TravelerEngagement & Document;

@Schema({ collection: 'traveler_engagement', timestamps: true })
export class TravelerEngagement {
  @Prop({ required: true, unique: true, index: true })
  user_id!: string;

  @Prop({ default: 0 })
  durability_score!: number; // 0–100 (synchronisé depuis PostgreSQL)

  @Prop({
    type: [{ label: String, obtained_at: Date }],
    default: [],
  })
  badges!: { label: string; obtained_at: Date }[];

  @Prop({ default: 0 })
  feedback_given!: number;

  @Prop({ default: 0 })
  plans_shared!: number;

  @Prop({ default: 0 })
  reservations_made!: number;
}

export const TravelerEngagementSchema =
  SchemaFactory.createForClass(TravelerEngagement);