import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './favorite.schema';
import mongoose, { Model } from 'mongoose';
import { contentType } from 'src/common/enums';
import { CharacterService } from 'src/character/character.service';
import { AnimeService } from 'src/anime/anime.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
    private characterService: CharacterService,
    private animeService: AnimeService,
  ) {}

  // add favorite list for user
  async addFavoriteList(contentId: string, userId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      throw new BadRequestException('Invalid content id');
    }
    const contentObjId = new mongoose.Types.ObjectId(contentId);
    const userObjId = new mongoose.Types.ObjectId(userId);
    const isFavoriteExists = await this.favoriteModel.findOne({
      contentId: contentObjId,
      userId: userObjId,
    });
    if (isFavoriteExists) {
      throw new ConflictException('Favorite already exists');
    }
    const favorite = await new this.favoriteModel({
      contentId: contentId,
      userId: userObjId,
    });
    await favorite.save();
    console.log('favorite ', favorite);
    return favorite;
  }

  async getMangaFavoriteList(userId: string): Promise<any> {
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'favorites',
          localField: 'userId',
          foreignField: 'userId',
          as: 'favoriteData',
        },
      },
      {
        $unwind: '$favoriteData',
      },
      {
        $project: {
          'favoriteData.contentId': 1,
          'favoriteData.date': 1,
          'favoriteData.userId': 1,
          'favoriteData._id': 1,
        },
      },
      {
        $lookup: {
          from: 'animes',
          localField: 'favoriteData.contentId',
          foreignField: '_id',
          as: 'contentData',
        },
      },
      {
        $unwind: '$contentData',
      },
      {
        $match: {
          'contentData.type': contentType.Manga, // Add this match stage to filter only manga types
        },
      },
      {
        $group: {
          _id: '$favoriteData._id',
          favoriteData: { $first: '$favoriteData' },
          contentData: { $addToSet: '$contentData' }, // Use $addToSet to ensure unique entries
        },
      },
      {
        $project: {
          favoriteData: 1,
          contentData: 1,
          _id: 0,
        },
      },
    ];

    const result = await this.favoriteModel.aggregate(pipeline);
    if (!result) {
      throw new NotFoundException('Favorite not found');
    }
    return result;
  }
  async getAnimeFavoriteList(userId: string): Promise<any> {
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'favorites',
          localField: 'userId',
          foreignField: 'userId',
          as: 'favoriteData',
        },
      },
      {
        $unwind: '$favoriteData',
      },
      {
        $project: {
          'favoriteData.contentId': 1,
          'favoriteData.date': 1,
          'favoriteData.userId': 1,
          'favoriteData._id': 1,
        },
      },
      {
        $lookup: {
          from: 'animes',
          localField: 'favoriteData.contentId',
          foreignField: '_id',
          as: 'contentData',
        },
      },
      {
        $unwind: '$contentData',
      },
      {
        $match: {
          'contentData.type': contentType.Anime, // Add this match stage to filter only manga types
        },
      },
      {
        $group: {
          _id: '$favoriteData._id',
          favoriteData: { $first: '$favoriteData' },
          contentData: { $addToSet: '$contentData' }, // Use $addToSet to ensure unique entries
        },
      },
      {
        $project: {
          favoriteData: 1,
          contentData: 1,
          _id: 0,
        },
      },
    ];

    const result = await this.favoriteModel.aggregate(pipeline);
    if (!result) {
      throw new NotFoundException('Favorite not found');
    }
    return result;
  }

  // get favorite characters for user
  async getCharactersFavoriteList(userId: string): Promise<any> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const favorites = await this.favoriteModel.find({
      userId: userObjId,
    });
    if (!favorites || favorites.length === 0) {
      throw new NotFoundException('Favorite not found');
    }
    const characterIds = favorites.map((favorite) => favorite.contentId);
    const characters =
      await this.characterService.getFavoriteCharacters(characterIds);
    return characters;
  }

  // delete favorite list
  async deleteFavoriteList(favoriteId, userId): Promise<any> {
    const result = await this.favoriteModel.deleteOne({
      userId: userId,
      _id: favoriteId,
    });
    if (!result) {
      throw new NotFoundException('Favorite not found');
    }
    return result;
  }

  async getTopFavoriteCharacters1(): Promise<any[]> {
    const favoritesCount = await this.favoriteModel.aggregate([
      {
        $group: {
          _id: '$contentId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10, // Change this to the number of top characters you want
      },
    ]);

    const topCharacterIds = favoritesCount.map((favorite) => favorite._id);

    // const topCharacters = await this.characterModel.find({
    //   _id: { $in: topCharacterIds },
    // });
    const topCharacters =
      await this.characterService.topCharactersIds(topCharacterIds);

    const result = topCharacters.map((character) => ({
      characterName: character.name,
      characterId: character._id,
      count:
        favoritesCount.find((favorite) => favorite._id.equals(character._id))
          ?.count || 0,
    }));

    return result;
  }

  // Get Top 10 Characters
  async getTopFavoriteCharacters(): Promise<any[]> {
    const favoritesCount = await this.favoriteModel.aggregate([
      {
        $group: {
          _id: '$contentId',
          favCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          favCount: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    const topCharacterIds = favoritesCount.map((favorite) => favorite._id);

    const topCharacters =
      await this.characterService.topCharactersIds(topCharacterIds);

    // Sort topCharacters based on the count in descending order
    topCharacters.sort((a, b) => {
      const countA =
        favoritesCount.find((favorite) => favorite._id.equals(a._id))
          ?.favCount || 0;
      const countB =
        favoritesCount.find((favorite) => favorite._id.equals(b._id))
          ?.favCount || 0;
      return countB - countA;
    });

    const result = topCharacters.map((character) => ({
      characterName: character.name,
      characterId: character._id,
      favCount:
        favoritesCount.find((favorite) => favorite._id.equals(character._id))
          ?.favCount || 0,
    }));

    return result;
  }
}
