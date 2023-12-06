import { Module, forwardRef } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { AnimeService } from 'src/anime/anime.service';
import { AnimeModule } from 'src/anime/anime.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './character.schema';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { FavoriteService } from 'src/favorite/favorite.service';

@Module({
  imports: [
    forwardRef(() => AnimeModule),
    forwardRef(() => FavoriteModule),
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService, AnimeService, FavoriteService],
  exports: [CharacterService, MongooseModule],
})
export class CharacterModule {}
