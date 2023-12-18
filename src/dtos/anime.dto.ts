import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ enum: contentType, example: contentType.Anime })
  @IsEnum(contentType)
  type: contentType;

  @ApiProperty({ example: 'My Anime Title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsNumber()
  episodesOrChapters: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  volumesOrSeasons: number;

  @ApiProperty({ example: 'Finished Airing' })
  @IsString()
  status: Status;

  @ApiProperty({ enum: Season, example: Season.Spring })
  @ApiProperty({ example: ['2023-01-01'] })
  @IsString()
  aired: String[];

  @ApiProperty({ enum: Season, example: Season.Spring })
  @IsEnum(Season)
  premiered: Season;

  @ApiProperty({ example: ['Action', 'Adventure'] })
  @IsString()
  genres: String[];

  @ApiProperty({ type: Date, example: '2023-01-01T12:00:00.000Z' })
  @Type(() => Date)
  @ValidateNested()
  @IsNotEmpty()
  broadcast: Date;

  @ApiProperty({ enum: Source, example: Source.Manga })
  @IsEnum(Source)
  source: Source;

  @ApiProperty({ enum: Audience, example: Audience.Shounen })
  @IsEnum(Audience)
  audience: Audience;

  @ApiProperty({ example: ['Japanese', 'English'] })
  @IsString()
  languages: String[];

  @ApiProperty({ example: ['Netflix', 'Crunchyroll'] })
  @IsString()
  streaming: String[];

  @ApiProperty({ example: ['Studio Ghibli'] })
  @IsString({})
  studios: string[];

  @ApiProperty({ example: ['Author Name'] })
  @IsString({})
  author: string[];

  @ApiProperty({ example: 24 })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ example: 'A brief description of your anime.' })
  @IsNotEmpty()
  @IsString()
  synopsis: string;
}
