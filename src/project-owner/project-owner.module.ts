import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectOwner } from './entities/project-owner.entity';
import { Project } from './entities/project.entity';
import { ProjectOwnerService } from './project-owner.service';
import { ProjectOwnerController } from './project-owner.controller';
import { ProjectOwnerMongoService } from './project-owner-mongo.service';
import { ProjectEngagement, ProjectEngagementSchema } from './schemas/project-engagement.schema';
import { ProjectServices, ProjectServicesSchema } from './schemas/project-services.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectOwner, Project]),
    MongooseModule.forFeature([
      { name: ProjectEngagement.name, schema: ProjectEngagementSchema },
      { name: ProjectServices.name, schema: ProjectServicesSchema },
    ]),
  ],
  providers: [ProjectOwnerService, ProjectOwnerMongoService],
  controllers: [ProjectOwnerController],
  exports: [ProjectOwnerService, ProjectOwnerMongoService],
})
export class ProjectOwnerModule {}
