import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Rating } from 'src/common/enums';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contentId: mongoose.Types.ObjectId;

  @Prop({ enum: Rating, required: true })
  rating: Rating;

  @Prop()
  review: string;

  @Prop({ default: Date.now })
  date: Date;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
