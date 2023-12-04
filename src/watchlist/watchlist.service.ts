import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WatchList } from './watchlist.schema';
import mongoose, { Model } from 'mongoose';
import { Options, contentType } from 'src/common/enums';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectModel(WatchList.name)
    private readonly watchListModel: Model<WatchList>,
  ) {}

  // Add To WatchList
  async addToWatchListService(contentId: string, userId: string): Promise<any> {
    const contentObjId = new mongoose.Types.ObjectId(contentId);
    const isWatchListExists = await this.watchListModel.findOne({
      contentId: contentObjId,
      userId: userId,
    });
    if (isWatchListExists) {
      throw new ConflictException('WatchList already exists');
    }
    const watchList = await new this.watchListModel({
      contentId: contentObjId,
      userId: userId,
    });
    await watchList.save();
    return watchList;
  }

  // get watchlist [Anime] True
  async getAnimeWatchList(userId: string, options: Options): Promise<any> {
    let state;
    if (options === Options.Yes) {
      state = true;
    } else {
      state = false;
    }
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isWatched: state,
        },
      },
      {
        $project: {
          _id: 1,
          contentId: 1,
        },
      },
      {
        $lookup: {
          from: 'animes', // Assuming your anime collection is named 'animes'
          localField: 'contentId',
          foreignField: '_id',
          as: 'animeData',
        },
      },
      {
        $unwind: '$animeData',
      },
      {
        $match: {
          'animeData.type': contentType.Anime,
        },
      },
      {
        $project: {
          watchListId: '$_id', // Include the watch list id in the result
          animeData: 1,
        },
      },
    ];

    const result = await this.watchListModel.aggregate(pipeline);
    console.log('result: ', result);
    if (!result) {
      throw new NotFoundException('WatchList not found');
    }
    return result;
  }

  // get watchlist [Manga]
  async getMangaWatchList(userId: string, options: Options): Promise<any> {
    let state;
    if (options === Options.Yes) {
      state = true;
    } else {
      state = false;
    }
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isWatched: state,
        },
      },
      {
        $project: {
          _id: 1,
          contentId: 1,
        },
      },
      {
        $lookup: {
          from: 'animes', // Assuming your anime collection is named 'animes'
          localField: 'contentId',
          foreignField: '_id',
          as: 'animeData',
        },
      },
      {
        $unwind: '$animeData',
      },
      {
        $match: {
          'animeData.type': contentType.Manga,
        },
      },
      {
        $project: {
          watchListId: '$_id', // Include the watch list id in the result
          animeData: 1,
        },
      },
    ];

    const result = await this.watchListModel.aggregate(pipeline);
    console.log('result: ', result);
    if (!result) {
      throw new NotFoundException('WatchList not found');
    }
    return result;
  }

  // delete watchlist
  async deleteWatchList(watchListId: string, userId: string): Promise<any> {
    const watchListObjId = new mongoose.Types.ObjectId(watchListId);
    const result = await this.watchListModel.deleteOne({
      _id: watchListObjId,
      userId: userId,
    });
    // if (!(result.acknowledged === true && result.deletedCount === 1)) {
    //   throw new NotFoundException('WatchList not found');
    // }
    console.log('result', result);
    return result;
  }

  // change isWatched
  async changeIsWatched(watchListId: string, userId: string): Promise<any> {
    const watchListObjId = new mongoose.Types.ObjectId(watchListId);
    const result = await this.watchListModel.updateOne(
      {
        _id: watchListObjId,
        userId: userId,
      },
      {
        $set: {
          isWatched: true,
        },
      },
    );
    return result;
  }
}

// result { acknowledged: true, deletedCount: 1 }
