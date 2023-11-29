import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Character } from './character.schema';
import { CreateCharacterDto } from '../dtos/character.dto';
import { AnimeService } from 'src/anime/anime.service';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name) private readonly character: Model<Character>,
    private animeService: AnimeService,
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
    const character = await this.character.find({
      contentId: isContentExist._id,
    });

    if (!character) {
      throw new NotFoundException('Characters not found');
    }
    return character;
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
    return character;
  }
}
