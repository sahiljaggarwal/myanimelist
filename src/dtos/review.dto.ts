import { IsEnum, IsString } from 'class-validator';
import { Rating } from 'src/common/enums';

export class ReviewDto {
  @IsEnum(Rating)
  rating: Rating;

  @IsString()
  review: string;
}
