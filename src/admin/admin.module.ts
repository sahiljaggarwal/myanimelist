import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnimeService } from 'src/anime/anime.service';
import { AnimeModule } from 'src/anime/anime.module';

@Module({
  imports: [AnimeModule],
  controllers: [AdminController],
  providers: [AdminService, AnimeService],
})
export class AdminModule {}
