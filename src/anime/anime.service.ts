import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Anime } from './anime.schema';
import mongoose, { Model } from 'mongoose';
import { AnimeDto } from 'src/dtos/anime.dto';
import { contentType } from 'src/common/enums';

@Injectable()
export class AnimeService {
  constructor(
    @InjectModel(Anime.name) private readonly contentModel: Model<Anime>,
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
}
