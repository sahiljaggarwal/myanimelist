import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { AnimeDto } from '../dtos/anime.dto';
import { AnimeService } from './anime.service';
import { ReviewService } from 'src/review/review.service';
import { Genre, Season, Status, contentType } from 'src/common/enums';
import { Anime } from './anime.schema';
import { CharacterService } from 'src/character/character.service';

@Controller('anime')
export class AnimeController {
  constructor(
    private animeService: AnimeService,
    private reviewService: ReviewService,
    private characterService: CharacterService,
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

  // Get Anime, Manga By Id Controller
  @Get('content/:id')
  @HttpCode(200)
  async getContentById(
    @Param() id: string,
  ): Promise<
    SuccessResponse<{ message: string; result: Anime }> | ErrorResponse
  > {
    try {
      // const result = await this.animeService.getContentById(id);
      const result = await this.reviewService.getContentWithAverageRating(id);
      return new SuccessResponse({ message: 'content data', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Anime By Type Controller
  @Get('content/type/anime')
  @HttpCode(200)
  async getContentByTypeAnime(): Promise<
    SuccessResponse<{ message: string; result: Anime[] }> | ErrorResponse
  > {
    try {
      const result = await this.animeService.getContentByTypeAnime();
      return new SuccessResponse({ message: 'content data', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Manga By Type Controller
  @Get('content/type/manga')
  @HttpCode(200)
  async getContentByTypeManga(): Promise<
    SuccessResponse<{ message: string; result: Anime[] }> | ErrorResponse
  > {
    try {
      const result = await this.animeService.getContentByTypeManga();
      return new SuccessResponse({ message: 'content data', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Content All Characters By Id
  @Get('content/characters/:id')
  @HttpCode(200)
  async getContentCharactersById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.characterService.getContentCharactersById(id);
      return new SuccessResponse({ message: 'characters data', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Content Single Character By Id
  @Get('content/character/:id')
  @HttpCode(200)
  async getContentCharacterById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.characterService.getContentCharacterById(id);
      return new SuccessResponse({ message: 'character data', result }, true);
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // get content by genre and type
  @Get('content/genre/:genre/:contentType')
  @HttpCode(200)
  async getContentByGenreAndType(
    @Param('genre') genre: Genre,
    @Param('contentType') contentType: contentType,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.animeService.getContentByGenreAndType(
        genre,
        contentType,
      );
      return new SuccessResponse(
        { message: 'genre and type content data', result },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Content By Season And Type
  @Get('content/season/:season/:contentType')
  @HttpCode(200)
  async getContentBySeasonsAndType(
    @Param('season') season: Season,
    @Param('contentType') contentType: contentType,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const content = await this.animeService.getContentBySeasonsAndType(
        season,
        contentType,
      );
      return new SuccessResponse(
        {
          message: 'season and type content data',
          content,
        },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Content By Status  And Type
  @Get('content/status/:status/:contentType')
  @HttpCode(200)
  async getContentByStatusAndType(
    @Param('status') status: Status,
    @Param('contentType') contentType: contentType,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const content = await this.animeService.getContentByStatusAndType(
        status,
        contentType,
      );
      return new SuccessResponse(
        {
          message: 'status and type content data',
          content,
        },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Search Anime Manga And Chharacter
  @Get()
  @HttpCode(200)
  async searchContent(
    @Query('title') title: string,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.animeService.search(title);
      return new SuccessResponse({ message: 'search result', result }, true);
    } catch (error) {
      return new ErrorResponse(error.message, 500, false);
    }
  }
}
