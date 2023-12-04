import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchList, WatchListSchema } from './watchlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WatchList.name,
        schema: WatchListSchema,
      },
    ]),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
