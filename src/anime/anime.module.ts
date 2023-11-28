import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimeSchema, Anime } from './anime.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Anime.name, schema: AnimeSchema }]),
  ],
  controllers: [AnimeController],
  providers: [AnimeService],
  exports: [AnimeService, MongooseModule],
})
export class AnimeModule {}
