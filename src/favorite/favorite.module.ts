import { Module, forwardRef } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './favorite.schema';
import { CharacterModule } from 'src/character/character.module';
import { CharacterService } from 'src/character/character.service';
import { AnimeModule } from 'src/anime/anime.module';
import { AnimeService } from 'src/anime/anime.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Favorite.name,
        schema: FavoriteSchema,
      },
    ]),
    // AnimeModule,
    forwardRef(() => CharacterModule),
    forwardRef(() => AnimeModule), // Ensure forwardRef here
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, CharacterService, AnimeService],
  exports: [MongooseModule],
})
export class FavoriteModule {}
