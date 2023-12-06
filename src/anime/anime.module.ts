import { Module, forwardRef } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimeSchema, Anime } from './anime.schema';
import { CharacterModule } from 'src/character/character.module';
import { CharacterService } from 'src/character/character.service';
import { ReviewModule } from 'src/review/review.module';
import { ReviewService } from 'src/review/review.service';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FavoriteService } from 'src/favorite/favorite.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Anime.name, schema: AnimeSchema }]),
    forwardRef(() => CharacterModule),
    ReviewModule,
    forwardRef(() => FavoriteModule),
  ],
  controllers: [AnimeController],
  providers: [AnimeService, CharacterService, ReviewService, FavoriteService],
  exports: [AnimeService, MongooseModule],
})
export class AnimeModule {}
