import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { Guide } from './entities/guide.entity';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import { GuideMongoService } from './guide-mongo.service';
import { GuideSkills, GuideSkillsSchema } from './schemas/guide-skills.schema';
import { GuideEngagement, GuideEngagementSchema } from './schemas/guide-engagement.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guide]),
    MongooseModule.forFeature([
      { name: GuideSkills.name, schema: GuideSkillsSchema },
      { name: GuideEngagement.name, schema: GuideEngagementSchema },
    ]),
  ],
  providers: [GuideService, GuideMongoService],
  controllers: [GuideController],
  exports: [GuideService, GuideMongoService],
})
export class GuideModule {}
