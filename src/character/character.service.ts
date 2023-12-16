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
import * as cloudinary from 'cloudinary';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FavoriteService } from 'src/favorite/favorite.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name) private readonly character: Model<Character>,
    @Inject(forwardRef(() => AnimeService))
    private animeService: AnimeService,

    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,

    private readonly configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('cloud_name'),
      api_key: this.configService.get<string>('api_key'),
      api_secret: this.configService.get<string>('api_secret'),
    });
  }

  // add content character
  async addContentCharacterForAdmin(
    id: string,
    content: CreateCharacterDto,
    character: Express.Multer.File,
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
    if (character) {
      try {
        const imageResult = await cloudinary.v2.uploader.upload(character.path);
        console.log('imageResult ', imageResult);
        newCharacter.image = imageResult.secure_url;
        console.log('addContent image', newCharacter.image);
      } catch (error) {
        console.log(error);
        console.log('Company Image Uploading Error');
      } finally {
        const imagePath = character.path;
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
    await newCharacter.save();
    return newCharacter;
  }

  // Update Content Character
  async updateContentCharacter(
    charcterId: string,
    characterData: CreateCharacterDto,
    character: Express.Multer.File,
  ): Promise<any> {
    const isCharacter = await this.character.findById(charcterId);
    if (!isCharacter) {
      throw new NotFoundException('Character not found');
    }
    if (characterData.name) {
      isCharacter.name = characterData.name;
    }
    if (characterData.bio) {
      isCharacter.bio = characterData.bio;
    }
    if (characterData.gender) {
      isCharacter.gender = characterData.gender;
    }

    let oldCharacterImagePublicId: string;
    if (isCharacter.image) {
      const parts = isCharacter.image.split('/');
      oldCharacterImagePublicId = parts[parts.length - 2];
    }

    if (character) {
      try {
        const characterImageResult = await cloudinary.v2.uploader.upload(
          character.path,
        );
        isCharacter.image = characterImageResult.secure_url;
        if (oldCharacterImagePublicId) {
          await cloudinary.v2.uploader.destroy(oldCharacterImagePublicId);
        }
      } catch (error) {
        console.log(error);
        console.log('Company Image Updating Error');
      } finally {
        const companyImagePath = character.path;
        if (companyImagePath) {
          // Delete the local image even if the Cloudinary upload fails
          try {
            await fs.unlink(companyImagePath);
            console.log(
              'Company Image Deleted Successfully From Local Storage (in finally)',
            );
          } catch (error) {
            console.log(error);
            console.log('Company Image Deleting Error(Local Storage)');
          }
        }
      }
    }

    await isCharacter.save();
    console.log('isCharacter after save', isCharacter);
    return isCharacter;
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
