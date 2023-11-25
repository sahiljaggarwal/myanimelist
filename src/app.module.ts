import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { GoogleStrategy } from './auth/google.strategy';
import { ConfigService } from '@nestjs/config';
import { AnimeModule } from './anime/anime.module';
import { AdminModule } from './admin/admin.module';
dotenv.config();

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.mongodb), AnimeModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, ConfigService],
})
export class AppModule {}