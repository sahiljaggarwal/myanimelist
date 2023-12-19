import {
  Controller,
  Post,
  HttpCode,
  Body,
  Inject,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { ErrorResponse } from 'src/common/ErrorResponse';
import { SuccessResponse } from 'src/common/SuccessResponse';
import { AnimeDto } from '../dtos/anime.dto';
import { AnimeService } from 'src/anime/anime.service';
import { Anime } from 'src/anime/anime.schema';
import { CharacterService } from 'src/character/character.service';
import { CreateCharacterDto } from 'src/dtos/character.dto';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Genre, Season, Status, contentType } from 'src/common/enums';
import { combineLatest } from 'rxjs';
import { Character } from 'src/character/character.schema';
import { ReviewService } from 'src/review/review.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/middlewares/multer.middleware';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private animeService: AnimeService,
    private characterService: CharacterService,
    private reviewService: ReviewService,
  ) {}

  // Add Anime, Manga Controller
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post('content/add')
  @ApiOperation({ summary: 'Add Anime or Manga' })
  @ApiResponse({
    status: 201,
    description: 'Content Added Successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Anime or Manga details with image',
    type: AnimeDto,
  })
  @HttpCode(201)
  async addContent(
    @Body() content: AnimeDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<SuccessResponse<{ message: string }> | ErrorResponse> {
    try {
      console.log('image', image);
      const result = await this.animeService.addContentByAdmin(content, image);
      return new SuccessResponse(
        { message: 'Content added successfully' },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Update Content(Anime, Manga)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiOperation({ summary: 'Update Anime or Manga' })
  @ApiResponse({
    status: 200,
    description: 'Content Updated Successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Anime or Manga details with image',
    type: AnimeDto,
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' })
  @Put('content/update/:id')
  @HttpCode(200)
  async updateContent(
    @Param('id') id: string,
    @Body() content: AnimeDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.animeService.updateContentByAdmin(
        id,
        content,
        image,
      );
      console.log('result', result);
      return new SuccessResponse(
        { message: 'Content updated successfully' },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Anime, Manga By Id Controller
  @Get('content/:id')
  @ApiOperation({ summary: 'Get Anime or Manga By Id' })
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' })
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
  @ApiOperation({ summary: 'Get Anime By Type' })
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
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
  @ApiOperation({ summary: 'Get Manga By Type' })
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
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

  // Add Content Character
  @UseInterceptors(FileInterceptor('character', multerConfig))
  @Post('content/character/:id')
  @ApiOperation({ summary: 'Add Content Character' })
  @ApiResponse({
    status: 201,
    description: 'Character Added Successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Character details with image',
    type: CreateCharacterDto,
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' })
  @HttpCode(201)
  async addContentCharacter(
    @Param('id') id: string,
    @Body() content: CreateCharacterDto,
    @UploadedFile() character: Express.Multer.File,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      console.log('id, ', id);
      const result = await this.characterService.addContentCharacterForAdmin(
        id,
        content,
        character,
      );
      return new SuccessResponse(
        { message: 'character added successfully' },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Update Content Character
  @UseInterceptors(FileInterceptor('character', multerConfig))
  @Put('content/character/:id')
  @ApiOperation({ summary: 'Update Content Character' })
  @ApiResponse({
    status: 200,
    description: 'Character Updated Successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Character details with image',
    type: CreateCharacterDto,
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' })
  @HttpCode(200)
  async updateContentCharacter(
    @Param('id') id: string,
    @Body() content: CreateCharacterDto,
    @UploadedFile() character: Express.Multer.File,
  ): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
      const result = await this.characterService.updateContentCharacter(
        id,
        content,
        character,
      );
      console.log(result);
      return new SuccessResponse(
        { message: 'character updated successfully' },
        true,
      );
    } catch (error) {
      console.log(error);
      return new ErrorResponse(error.message, 500, false);
    }
  }

  // Get Content All Characters By Id
  @Get('content/characters/:id')
  @ApiOperation({ summary: 'Get Content All Characters By Id' })
  @ApiResponse({
    status: 200,
    description: 'Characters Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: 'string' })
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
  @ApiOperation({ summary: 'Get Content Single Character By Id' })
  @ApiResponse({
    status: 200,
    description: 'Character Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiParam({ name: 'id', description: 'Character ID', type: 'string' })
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
  @ApiOperation({ summary: 'Get Content By Genre and Type' })
  @ApiResponse({
    status: 200,
    description: 'Content Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiParam({
    name: 'genre',
    description: 'Genre',
    enum: ['Action', 'Comedy', 'Drama'],
    type: 'string',
  })
  @ApiParam({
    name: 'contentType',
    description: 'Content Type',
    enum: ['anime', 'manga'],
    type: 'string',
  })
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
  @ApiOperation({ summary: 'Get Content By Season And Type' })
  @ApiResponse({
    status: 200,
    description: 'Season and Type Content Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiParam({ name: 'season', description: 'Season', enum: Season })
  @ApiParam({
    name: 'contentType',
    description: 'Content Type',
    enum: contentType,
  })
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

  // Get Content By Status And Type
  @Get('content/status/:status/:contentType')
  @ApiOperation({ summary: 'Get Content By Status And Type' })
  @ApiResponse({
    status: 200,
    description: 'Status and Type Content Data',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiParam({ name: 'status', description: 'Status', enum: Status })
  @ApiParam({
    name: 'contentType',
    description: 'Content Type',
    enum: contentType,
  })
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
  @ApiOperation({ summary: 'Search Anime Manga And Character' })
  @ApiResponse({
    status: 200,
    description: 'Search Result',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  @ApiQuery({ name: 'title', description: 'Search Title' })
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
