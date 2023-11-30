import mongoose, { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contentId: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  date: Date;
}
export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
