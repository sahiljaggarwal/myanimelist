import {
  Controller,
  HttpCode,
  Post,
  Req,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ReviewDto } from 'src/dtos/review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  // Add Review
  @Post(':contentId')
  @HttpCode(201)
  async addReview(
    @Req() req: any,
    @Body() reviewDto: ReviewDto,
    @Param('contentId') contentId: string,
  ) {
    try {
      const userId = req['user']._id;
      const result = await this.reviewService.addReview(
        contentId,
        userId,
        reviewDto,
      );
      return new SuccessResponse({ message: 'review added', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get reviews by contentId
  @Get(':contentId')
  async getReviewsByContentId(@Param('contentId') contentId: string) {
    try {
      const result = await this.reviewService.getRviewByContentId(contentId);
      return new SuccessResponse({ message: 'reviews', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
