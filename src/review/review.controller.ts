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
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ReviewDto } from 'src/dtos/review.dto';
import { ReviewService } from './review.service';

@ApiTags('Review')
@ApiBearerAuth()
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  // Add Review
  @Post(':contentId')
  @ApiOperation({ summary: 'Add Review' }) // Swagger annotation
  @ApiResponse({
    status: 201,
    description: 'Review added',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({ name: 'contentId', description: 'Content ID', type: 'string' }) // Swagger annotation
  @ApiBody({ type: ReviewDto }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Reviews by Content ID' }) // Swagger annotation
  @ApiResponse({ status: 200, description: 'Reviews', type: SuccessResponse }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({ name: 'contentId', description: 'Content ID', type: 'string' }) // Swagger annotation
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
