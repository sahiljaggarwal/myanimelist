import { Module, forwardRef } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { AnimeService } from 'src/anime/anime.service';
import { AnimeModule } from 'src/anime/anime.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './character.schema';

@Module({
  imports: [
    forwardRef(() => AnimeModule),
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService, AnimeService],
  exports: [CharacterService, MongooseModule],
})
export class CharacterModule {}
