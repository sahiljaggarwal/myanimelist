import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { AnimeDto } from '../dtos/anime.dto';
import { AnimeService } from './anime.service';
import { ReviewService } from 'src/review/review.service';
import { contentType } from 'src/common/enums';

@Controller('anime')
export class AnimeController {
  constructor(
    private animeService: AnimeService,
    private reviewService: ReviewService,
  ) {}

  // get top animes by ratings
  @Get('top/:type')
  @HttpCode(200)
  async getTopAnimes(
    @Param('type') type: contentType,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.reviewService.getTopRatedContents(type);
      return new SuccessResponse({ message: 'top animes', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
