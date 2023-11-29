import mongoose, { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Gender, common } from 'src/common/enums';

@Schema({ timestamps: true })
export class Character {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contentId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: Gender, default: Gender.NotAvailable })
  gender: Gender;

  @Prop({ default: common.NotAvailable })
  bio: string;

  @Prop()
  image: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
