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
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Character } from 'src/character/character.schema';

@Injectable()
export class AnimeService {
  constructor(
    @InjectModel(Anime.name) private readonly contentModel: Model<Anime>,
    @Inject(forwardRef(() => CharacterService))
    private readonly characterService: CharacterService,
    private readonly configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('cloud_name'),
      api_key: this.configService.get<string>('api_key'),
      api_secret: this.configService.get<string>('api_secret'),
    });
  }

  // Add Animes By Admin
  async addContentByAdmin(
    content: AnimeDto,
    image: Express.Multer.File,
  ): Promise<any> {
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

    const imagePath = image.path;
    console.log('imagePath', imagePath);

    if (image) {
      try {
        const imageResult = await cloudinary.v2.uploader.upload(image.path);
        console.log('imageResult ', imageResult);
        addContent.image = imageResult.secure_url;
        console.log('addContent image', addContent.image);
      } catch (error) {
        console.log(error);
        console.log('Company Image Uploading Error');
      } finally {
        const imagePath = image.path;
        if (imagePath) {
          // Delete the local image even if the Cloudinary upload fails
          try {
            await fs.unlink(imagePath);
            console.log(
              'Company Image Deleted Successfully From Local Storage (in finally)',
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    await addContent.save();
    console.log('addContent', addContent);
    return addContent;
  }

  // Update Animes By Admin
  async updateContentByAdmin(
    contentId: string,
    content: AnimeDto,
    image: Express.Multer.File,
  ): Promise<any> {
    const updateContent = await this.contentModel.findByIdAndUpdate(
      contentId,
      { ...content },
      { new: true },
    );
    if (!updateContent) {
      throw new NotFoundException('Content not found');
    }

    let oldContentImagePublicId: string;
    if (updateContent.image) {
      const parts = updateContent.image.split('/');
      oldContentImagePublicId = parts[parts.length - 2];
    }
    if (image) {
      try {
        const contentImageResult = await cloudinary.v2.uploader.upload(
          image.path,
        );
        updateContent.image = contentImageResult.secure_url;
        if (oldContentImagePublicId) {
          await cloudinary.v2.uploader.destroy(oldContentImagePublicId);
        }
      } catch (error) {
        console.log('Image Updating Error', error);
      } finally {
        const contentImagePath = image.path;
        if (contentImagePath) {
          try {
            await fs.unlink(contentImagePath);
            console.log(
              'Content Image Deleted Successfully From Local Storage',
            );
          } catch (error) {
            console.log(error);
            console.log('Company Image Deleted Error (Local Storage)');
          }
        }
      }
    }
    await updateContent.save();
    return updateContent;
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

  // get top 10 animes by ratings
  async getTopRatedAnimes(): Promise<any[]> {
    const result = await this.contentModel.aggregate([
      {
        $match: {
          rating: { $in: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] }, // Filter out invalid ratings
        },
      },
      {
        $group: {
          _id: '$contentId', // Assuming contentId is the reference to anime
          count: { $sum: 1 },
          avgRating: { $avg: { $toDouble: '$rating' } }, // Convert rating to numeric for average
        },
      },
      {
        $lookup: {
          from: 'animes', // Change this to the actual collection name for animes
          localField: '_id',
          foreignField: '_id',
          as: 'animeData',
        },
      },
      {
        $unwind: '$animeData',
      },
      {
        $project: {
          animeTitle: '$animeData.title',
          animeId: '$animeData._id',
          count: 1,
          avgRating: 1,
        },
      },
    ]);
    return result;
  }
}
