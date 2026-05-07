import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Answer,
  Question,
  QuestionCategory,
  Questionnaire,
  QuestionnaireAttempt,
  UserAnswer,
} from './entities/questionnaire.entities';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';
import { EcoTravelerModule } from '../eco-traveler/eco-traveler.module';
import { GuideModule } from '../guide/guide.module';
import { ProjectOwnerModule } from '../project-owner/project-owner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Questionnaire,
      QuestionCategory,
      Question,
      Answer,
      QuestionnaireAttempt,
      UserAnswer,
    ]),
    EcoTravelerModule,
    GuideModule,
    ProjectOwnerModule,
  ],
  providers: [QuestionnaireService],
  controllers: [QuestionnaireController],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}