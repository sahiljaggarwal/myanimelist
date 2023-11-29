import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnimeService } from 'src/anime/anime.service';
import { AnimeModule } from 'src/anime/anime.module';
import { CharacterModule } from 'src/character/character.module';
import { CharacterService } from 'src/character/character.service';

@Module({
  imports: [AnimeModule, CharacterModule],
  controllers: [AdminController],
  providers: [AdminService, AnimeService, CharacterService],
})
export class AdminModule {}
