import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class WatchList {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  contentId: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: false })
  isWatched: boolean;
}

export const WatchListSchema = SchemaFactory.createForClass(WatchList);
