import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Rating } from 'src/common/enums';

class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contentId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  reviewId: mongoose.Types.ObjectId;

  @Prop({ type: Rating, required: true })
  rating: Rating;

  @Prop()
  review: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
