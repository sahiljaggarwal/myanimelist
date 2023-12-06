import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnimeService } from 'src/anime/anime.service';
import { AnimeModule } from 'src/anime/anime.module';
import { CharacterModule } from 'src/character/character.module';
import { CharacterService } from 'src/character/character.service';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FavoriteService } from 'src/favorite/favorite.service';
import { ReviewModule } from 'src/review/review.module';
import { ReviewService } from 'src/review/review.service';

@Module({
  imports: [AnimeModule, CharacterModule, FavoriteModule, ReviewModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AnimeService,
    CharacterService,
    FavoriteService,
    ReviewService,
  ],
})
export class AdminModule {}
