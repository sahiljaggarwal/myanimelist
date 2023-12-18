import { IsEnum, IsString } from 'class-validator';
import { Rating } from 'src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty({ enum: Rating, example: Rating.FiveStar })
  @IsEnum(Rating)
  rating: Rating;

  @ApiProperty({ example: 'This is a great review!' })
  @IsString()
  review: string;
}
