import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Genre,
  Language,
  Season,
  Source,
  Status,
  StreamingSource,
  Audience,
  contentType,
} from 'src/common/enums';

export class AnimeDto {
  @IsEnum(contentType)
  type: contentType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  episodesOrChapters: number;

  @IsNotEmpty()
  @IsNumber()
  volumesOrSeasons: number;

  @IsString()
  status: String;

  @IsString()
  aired: String[];

  @IsEnum(Season)
  premiered: Season;

  @IsString()
  genres: String[];

  @Type(() => Date)
  @ValidateNested()
  @IsNotEmpty()
  broadcast: Date;

  @IsEnum(Source)
  source: Source;

  @IsEnum(Audience)
  audience: Audience;

  @IsString()
  languages: String[];

  @IsString()
  streaming: String[];

  @IsString({})
  studios: string[];

  @IsString({})
  author: string[];

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsString()
  synopsis: string;
}
