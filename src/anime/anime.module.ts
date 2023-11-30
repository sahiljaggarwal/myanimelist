import { Module, forwardRef } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimeSchema, Anime } from './anime.schema';
import { CharacterModule } from 'src/character/character.module';
import { CharacterService } from 'src/character/character.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Anime.name, schema: AnimeSchema }]),
    forwardRef(() => CharacterModule),
  ],
  controllers: [AnimeController],
  providers: [AnimeService, CharacterService],
  exports: [AnimeService, MongooseModule],
})
export class AnimeModule {}
