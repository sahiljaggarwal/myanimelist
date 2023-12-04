import {
  Controller,
  HttpCode,
  Post,
  Req,
  Param,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { WatchlistService } from './watchlist.service';
import { Options } from '../common/enums';

@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  // Add To WatchList
  @Post('add/:contentId')
  @HttpCode(201)
  async addToWatchList(
    @Param('contentId') contentId: string,
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      console.log('userId....', userId);
      const result = await this.watchlistService.addToWatchListService(
        contentId,
        userId,
      );

      return new SuccessResponse(
        { message: 'added to watchlist', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get watchlist [Anime]
  @Get('anime/:options')
  @HttpCode(200)
  async getAnimeWatchList(
    @Req() req: any,
    @Param('options') options: Options,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.watchlistService.getAnimeWatchList(
        userId,
        options,
      );
      return new SuccessResponse({ message: 'watchlist: ', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get watchlist [Anime]
  @Get('manga/:options')
  @HttpCode(200)
  async getMangaWatchList(
    @Req() req: any,
    @Param('options') options: Options,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.watchlistService.getMangaWatchList(
        userId,
        options,
      );
      return new SuccessResponse({ message: 'watchlist: ', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // delete from watchlist
  @Delete('/:watchListId')
  @HttpCode(200)
  async deleteWatchList(
    @Param('watchListId') watchListId: string,
    @Req() req: any,
  ): Promise<any> {
    try {
      const userId = req['user']._id;
      const result = await this.watchlistService.deleteWatchList(
        watchListId,
        userId,
      );
      return new SuccessResponse({ message: 'deleted' }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Change IsWatched
  @Patch('/:watchListId')
  @HttpCode(200)
  async changeIsWatched(
    @Param('watchListId') watchListId: string,
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.watchlistService.changeIsWatched(
        watchListId,
        userId,
      );
      return new SuccessResponse({ message: 'changed', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
