import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';


import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';




@Module({
  imports: [
    
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    PassportModule
  ],
  providers: [GoogleStrategy],
})
export class AppModule {}
