import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Character } from './character.schema';
import { CreateCharacterDto } from '../dtos/character.dto';
import { AnimeService } from 'src/anime/anime.service';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name) private readonly character: Model<Character>,
    @Inject(forwardRef(() => AnimeService))
    private animeService: AnimeService,

    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
  ) {}

  // add content character
  async addContentCharacterForAdmin(
    id: string,
    content: CreateCharacterDto,
  ): Promise<Character> {
    const isContentExist = await this.animeService.getContentById(id);
    const { name, gender, bio } = content;
    if (!name) {
      throw new BadRequestException('Name is required');
    }
    const newCharacter = await new this.character({
      contentId: isContentExist._id,
      name,
      gender,
      bio,
    });
    await newCharacter.save();
    return newCharacter;
  }

  // get characters by content id
  async getContentCharactersById(id: string): Promise<any> {
    const isContentExist = await this.animeService.getContentById(id);
    const characters = await this.character.find({
      contentId: isContentExist._id,
    });

    if (!characters || characters.length === 0) {
      throw new NotFoundException('Characters not found');
    }
    return characters;
  }
  // get character by content id
  async getContentCharacterById(id: string): Promise<any> {
    const objId = new mongoose.Types.ObjectId(id);
    const character = await this.character.findOne({
      _id: objId,
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }
    const favoriteCount =
      await this.favoriteService.getFavoriteCountByContentId(id);
    // return character;
    return {
      ...character.toObject(),
      favoriteCount,
    };
  }

  // Character Search
  private prepareSearchQuery(title: string): { name: RegExp } {
    const formattedTitle = new RegExp(title, 'i'); // 'i' for case-insensitive
    return { name: formattedTitle };
  }

  async searchCharacter(title: string): Promise<any> {
    const characterResult = await this.character
      .find(this.prepareSearchQuery(title))
      .exec();
    return characterResult;
  }

  async getFavoriteCharacters(characterIds: any): Promise<any> {
    const characters = await this.character.find({
      _id: { $in: characterIds },
    });
    return characters;
  }

  // top character finder
  async topCharactersIds(topCharacterIds: any) {
    const topCharacters = await this.character.find({
      _id: { $in: topCharacterIds },
    });
    return topCharacters;
  }
}
