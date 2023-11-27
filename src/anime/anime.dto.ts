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

  @IsEnum(Status)
  status: Status;

  @Type(() => Date)
  @ValidateNested()
  aired: Date[];

  @IsEnum(Season)
  premiered: Season;

  @IsEnum(Genre, { each: true })
  genres: Genre[];

  @Type(() => Date)
  @ValidateNested()
  @IsNotEmpty()
  broadcast: Date;

  @IsEnum(Source)
  source: Source;

  @IsEnum(Audience)
  audience: Audience;

  @IsEnum(Language, { each: true })
  languages: Language[];

  @IsEnum(StreamingSource, { each: true })
  streaming: StreamingSource[];

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
