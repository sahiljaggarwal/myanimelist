import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { ReviewDto } from 'src/dtos/review.dto';
import mongoose from 'mongoose';
import { contentType } from 'src/common/enums';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  // add review
  async addReview(
    contentId: string,
    userId: string,
    reviewDto: ReviewDto,
  ): Promise<any> {
    const { review, rating } = reviewDto;
    if (!review || !rating) {
      throw new BadRequestException('Please provide review and rating');
    }
    const newReview = await new this.reviewModel({
      contentId: contentId,
      userId: userId,
      rating: rating,
      review: review,
    });
    await newReview.save();
    return newReview;
  }

  // get review by contentId
  async getRviewByContentId(contentId: string): Promise<any> {
    const contentObjId = new mongoose.Types.ObjectId(contentId);
    const pipeline = [
      {
        $match: {
          contentId: contentObjId,
        },
      },
    ];
    const reviews = await this.reviewModel.aggregate(pipeline);
    if (!reviews) {
      throw new NotFoundException('Review not found');
    }
    return reviews;
  }

  // delete review by Id [Admin]
  async deleteReviewById(reviewId: string): Promise<any> {
    const reviewObjId = new mongoose.Types.ObjectId(reviewId);
    const deleteReview = await this.reviewModel.deleteOne({
      _id: reviewObjId,
    });
    return deleteReview;
  }

  async getTopRatedContents(type: contentType): Promise<any[]> {
    let state;
    if (type === contentType.Anime) {
      state = contentType.Anime;
    } else if (type === contentType.Manga) {
      state = contentType.Manga;
    } else {
      throw new BadRequestException('Invalid type');
    }
    const result = await this.reviewModel.aggregate([
      {
        $match: {
          rating: { $in: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
        },
      },
      {
        $group: {
          _id: '$contentId',
          count: { $sum: 1 },
          avgRating: { $avg: { $toDouble: '$rating' } },
        },
      },
      {
        $lookup: {
          from: 'animes',
          localField: '_id',
          foreignField: '_id',
          as: 'animeData',
        },
      },
      {
        $unwind: '$animeData',
      },
      {
        $match: {
          'animeData.type': state,
        },
      },
      {
        $sort: {
          avgRating: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          animeTitle: '$animeData.title',
          animeId: '$animeData._id',
          count: 1,
          avgRating: 1,
        },
      },
    ]);

    return result;
  }
}
