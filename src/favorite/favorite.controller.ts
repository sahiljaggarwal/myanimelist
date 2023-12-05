import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { ErrorResponse } from 'src/common/ErrorResponse';
import mongoose from 'mongoose';

@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  // add favorite list for user
  @Post('add/:contentId/')
  @HttpCode(200)
  async addFavoriteList(
    @Param('contentId') contentId: string,
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      console.log('userId', userId);
      const result = await this.favoriteService.addFavoriteList(
        contentId,
        userId,
      );
      return new SuccessResponse(
        {
          message: 'favorite added',
          result,
        },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get favorite list for user managa
  @Get('manga')
  @HttpCode(200)
  async getFavoriteManga(
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      console.log('userId', userId);
      const result = await this.favoriteService.getMangaFavoriteList(userId);
      return new SuccessResponse(
        { message: 'manga favorite list', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get favorite list for user anime
  @Get('anime')
  @HttpCode(200)
  async getFavoriteAnime(
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.favoriteService.getAnimeFavoriteList(userId);
      return new SuccessResponse(
        { message: 'anime favorite list', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get favorite list for user managa
  @Get('character')
  @HttpCode(200)
  async getFavoriteCharacter(
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result =
        await this.favoriteService.getCharactersFavoriteList(userId);
      return new SuccessResponse(
        { message: 'anime favorite list', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Delete favorite list
  @Delete(':favoriteId')
  @HttpCode(200)
  async deleteFavoriteList(
    @Param('favoriteId') favoriteId: string,
    @Req() req: any,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const userId = req['user']._id;
      const result = await this.favoriteService.deleteFavoriteList(
        favoriteId,
        userId,
      );
      return new SuccessResponse(
        {
          message: 'favorite deleted',
          result,
        },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get Top Character
  @Get('top/character')
  @HttpCode(200)
  async getTopCharacter(): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.favoriteService.getTopFavoriteCharacters();
      return new SuccessResponse({ message: 'top character', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
