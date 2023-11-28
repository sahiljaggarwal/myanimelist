import mongoose, { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Gender, common } from 'src/common/enums';

@Schema({ timestamps: true })
export class Character extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contentId: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ enum: Gender, default: Gender.NotAvailable })
  gender: Gender;

  @Prop()
  age: string;

  @Prop()
  birthday: string;

  @Prop({ default: common.NotAvailable })
  bio: string;

  @Prop()
  image: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
