import { IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @ApiProperty({ example: 'Kaguya Sama' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Gender, example: Gender.Male })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'My Charcter Bio' })
  @IsString()
  bio: string;
}
