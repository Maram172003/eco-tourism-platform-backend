import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectServicesDocument = ProjectServices & Document;

@Schema({ collection: 'project_services', timestamps: true })
export class ProjectServices {
  @Prop({ required: true, index: true })
  project_id!: string;

  @Prop({ required: true, index: true })
  owner_id!: string;

  @Prop({ type: [String], default: [] })
  offered_services!: string[];

  @Prop({ type: [String], default: [] })
  eco_practices!: string[];

  @Prop({ type: [String], default: [] })
  target_travelers!: string[];
}

export const ProjectServicesSchema = SchemaFactory.createForClass(ProjectServices);
