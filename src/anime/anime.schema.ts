import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  Audience,
  Genre,
  Language,
  Season,
  Source,
  Status,
  StreamingSource,
  contentType,
} from 'src/common/enums';

@Schema({ timestamps: true })
export class Anime extends Document {
  @Prop({ enum: contentType, default: contentType.Anime, index: true }) // Anime Manga Light Novel
  type: string;

  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true })
  episodesOrChapters: number; // manga chapters for manga and animes episodes for animes

  @Prop()
  volumesOrSeasons: number; // manga voumes for manga and animes seasons for animes

  @Prop({ enum: Status, default: Status.NotYetAired, index: true })
  status: Status;

  @Prop({ type: [Date], required: true, index: true })
  aired: Date[];

  @Prop({ enum: Season, index: true })
  premiered: Season;

  @Prop({
    type: [String],
    enum: Genre,
    default: Genre.NotAvailable,
    index: true,
  })
  genres: Genre[];

  @Prop({ required: true, index: true })
  broadcast: Date;

  @Prop({ enum: Source, default: Source.NotAvailable, index: true })
  source: Source;

  @Prop({ enum: Audience, default: Audience.NotAvailable, index: true })
  audience: Audience;

  @Prop({ type: [String], enum: Language, index: true })
  languages: Language[];

  @Prop({
    type: [String],
    enum: StreamingSource,
    default: StreamingSource.NotAvailable,
    index: true,
  })
  streaming: StreamingSource[];

  @Prop({ type: [String], index: true })
  studios: string[];

  @Prop({ type: [String], index: true }) //  Studio Schema Isstemal hoga yha par
  author: string[];

  @Prop()
  image: string; // Image Store hogi with interceptor

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  synopsis: string;
}

export const AnimeSchema = SchemaFactory.createForClass(Anime);
