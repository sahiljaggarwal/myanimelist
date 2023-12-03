import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './favorite.schema';
import { CharacterModule } from 'src/character/character.module';
import { CharacterService } from 'src/character/character.service';
import { AnimeModule } from 'src/anime/anime.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Favorite.name,
        schema: FavoriteSchema,
      },
    ]),
    CharacterModule,
    AnimeModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, CharacterService, AnimeModule],
})
export class FavoriteModule {}
