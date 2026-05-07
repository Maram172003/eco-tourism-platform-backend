import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';


import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongodbModule } from './database/mongodb.module';
import { EcoTravelerModule } from './eco-traveler/eco-traveler.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { GuideModule } from './guide/guide.module';
import { ProjectOwnerModule } from './project-owner/project-owner.module';





@Module({
  imports: [
    
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    PassportModule,
    MongodbModule,
    EcoTravelerModule,
    QuestionnaireModule,
    GuideModule,
    ProjectOwnerModule,
  ],
  providers: [GoogleStrategy],
})
export class AppModule {}
