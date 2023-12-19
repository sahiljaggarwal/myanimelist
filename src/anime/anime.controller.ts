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
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Genre, Season, Status, contentType } from 'src/common/enums';
import { Anime } from './anime.schema';
import { CharacterService } from 'src/character/character.service';

@ApiTags('Anime')
@ApiBearerAuth()
@Controller('anime')
export class AnimeController {
  constructor(
    private animeService: AnimeService,
    private reviewService: ReviewService,
    private characterService: CharacterService,
  ) {}

  // get top animes by ratings
  @Get('top/:type')
  @ApiOperation({ summary: 'Get Top Animes by Ratings' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Top Animes',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({
    name: 'type',
    description: 'Content Type',
    enum: ['anime', 'manga'],
  }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Anime or Manga By Id' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Anime By Type' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Manga By Type' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Content All Characters By Id' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Characters Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Content Single Character By Id' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Character Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({ name: 'id', description: 'Character ID', type: 'string' }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Content By Genre and Type' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({
    name: 'genre',
    description: 'Genre',
    enum: ['Action', 'Comedy', 'Drama'],
    type: 'string',
  }) // Swagger annotation
  @ApiParam({
    name: 'contentType',
    description: 'Content Type',
    enum: ['anime', 'manga'],
    type: 'string',
  }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Content By Season and Type' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({
    name: 'season',
    description: 'Season',
    enum: ['Spring', 'Summer', 'Fall', 'Winter'],
    type: 'string',
  }) // Swagger annotation
  @ApiParam({
    name: 'contentType',
    description: 'Content Type',
    enum: ['anime', 'manga'],
    type: 'string',
  }) // Swagger annotation
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
  @ApiOperation({ summary: 'Get Content By Status and Type' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiParam({
    name: 'status',
    description: 'Status',
    enum: ['Ongoing', 'Completed'],
    type: 'string',
  }) // Swagger annotation
  @ApiParam({
    name: 'contentType',
    description: 'Content Type',
    enum: ['anime', 'manga'],
    type: 'string',
  }) // Swagger annotation
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
  @ApiOperation({ summary: 'Search Anime, Manga, and Character' }) // Swagger annotation
  @ApiResponse({
    status: 200,
    description: 'Search Result',
    type: SuccessResponse,
  }) // Swagger annotation
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  }) // Swagger annotation
  @ApiQuery({ name: 'title', description: 'Search Title', type: 'string' }) // Swagger annotation
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
