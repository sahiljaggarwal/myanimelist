import { IsEnum, IsString } from 'class-validator';
import { Gender } from 'src/common/enums';

export class CreateCharacterDto {
  @IsString()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  bio: string;
}
