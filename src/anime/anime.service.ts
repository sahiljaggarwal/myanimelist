import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Anime } from './anime.schema';
import mongoose, { Model } from 'mongoose';
import { AnimeDto } from 'src/dtos/anime.dto';
import { Genre, Season, Status, contentType } from 'src/common/enums';
import { CharacterService } from 'src/character/character.service';
import { Character } from 'src/character/character.schema';

@Injectable()
export class AnimeService {
  constructor(
    @InjectModel(Anime.name) private readonly contentModel: Model<Anime>,
    @Inject(forwardRef(() => CharacterService))
    private readonly characterService: CharacterService,
  ) {}

  // Add Animes By Admin
  async addContentByAdmin(content: AnimeDto): Promise<any> {
    const {
      type,
      title,
      episodesOrChapters,
      volumesOrSeasons,
      status,
      aired,
      premiered,
      genres,
      broadcast,
      source,
      audience,
      languages,
      streaming,
      studios,
      author,
      duration,
      synopsis,
    } = content;
    const fieldsToCheck = [
      'type',
      'title',
      'episodesOrChapters',
      'volumesOrSeasons',
      'status',
      'aired',
      'premiered',
      'genres',
      'broadcast',
      'source',
      'audience',
      'languages',
      'streaming',
      'studios',
      'author',
      'duration',
      'synopsis',
    ];
    const emptyFields = [];
    for (const field of fieldsToCheck) {
      if (!content[field]) {
        emptyFields.push(field);
      }
    }

    if (emptyFields.length > 0) {
      const emptyFieldsString = emptyFields.join(' , ');
      throw new BadRequestException(`${emptyFieldsString} fileds are required`);
    }

    const addContent = await new this.contentModel({
      type,
      title,
      episodesOrChapters,
      volumesOrSeasons,
      status,
      aired,
      premiered,
      genres,
      broadcast,
      source,
      audience,
      languages,
      streaming,
      studios,
      author,
      duration,
      synopsis,
    });

    await addContent.save();
    return addContent;
  }

  // Get Content By Id For Both Admin And User
  async getContentById(contentId: any): Promise<Anime> {
    const contentObjId = new mongoose.Types.ObjectId(contentId);
    const content = await this.contentModel.findById(contentObjId);
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  // Get Content By Type
  async getContentByTypeAnime(): Promise<Anime[]> {
    const content = await this.contentModel.find({ type: contentType.Anime });
    if (!content) {
      throw new NotFoundException('Anime not found');
    }
    return content;
  }

  // Get Content By Type
  async getContentByTypeManga(): Promise<Anime[]> {
    const content = await this.contentModel.find({ type: contentType.Manga });
    if (!content) {
      throw new NotFoundException('Manga not found');
    }
    return content;
  }

  // get content by genre and type
  async getContentByGenreAndType(
    genre: Genre,
    type: contentType,
  ): Promise<Anime[]> {
    const content = await this.contentModel.find({ type: type, genres: genre });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  // get content by seasons and type
  async getContentBySeasonsAndType(
    season: Season,
    contentType: contentType,
  ): Promise<Anime[]> {
    const content = await this.contentModel.find({
      type: contentType,
      premiered: season,
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  // get content by status of anime
  async getContentByStatusAndType(
    status: Status,
    contentType: contentType,
  ): Promise<Anime[]> {
    console.log(status);
    console.log(contentType);
    const content = await this.contentModel.find({
      type: contentType,
      status: status,
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  // Search Anime, Manga, Character

  private prepareSearchQuery(title: string): { title: RegExp } {
    const formattedTitle = new RegExp(title, 'i'); // 'i' for case-insensitive
    return { title: formattedTitle };
  }

  async search(
    title: string,
  ): Promise<{ anime: Anime[]; characters: Character[] }> {
    console.log('title, ', title);
    const animeResult = await this.contentModel
      .find(this.prepareSearchQuery(title))
      .exec();

    const characterResult = await this.characterService.searchCharacter(title);
    console.log('characters', characterResult);

    return { anime: animeResult, characters: characterResult };
  }

  // get favorite manga from favorite ids
  async getFavoriteFromFavoritesId(favoriteIds: any): Promise<any> {
    const mangaData = await this.contentModel.find({
      _id: { $in: favoriteIds },
      type: contentType.Manga,
    });
    if (!mangaData) {
      throw new NotFoundException('Favorite not found');
    }
    return mangaData;
  }
}
