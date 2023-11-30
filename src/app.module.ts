import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { GoogleStrategy } from './auth/google.strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AnimeModule } from './anime/anime.module';
import { AdminModule } from './admin/admin.module';
import { TokenMiddleware } from './middlewares/token.middleware';
import { ALL } from 'dns';
import { RoleCheckMiddleware } from './middlewares/role.middleware';
import { JwtService } from '@nestjs/jwt';
import { CharacterModule } from './character/character.module';
import { FavoriteModule } from './favorite/favorite.module';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.mongodb),
    AnimeModule,
    AdminModule,
    CharacterModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, ConfigService, JwtService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // token middleware
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'auth/google', method: RequestMethod.ALL },
        { path: 'auth/google/callback', method: RequestMethod.ALL },
      )
      .forRoutes('*');

    // admin middleware
    const adminMiddleware = new RoleCheckMiddleware('admin').createMiddleware();
    const userMiddleware = new RoleCheckMiddleware('user').createMiddleware();
    consumer
      .apply(adminMiddleware)
      .exclude({ path: 'auth/**', method: RequestMethod.ALL })
      .forRoutes({ path: 'admin/**', method: RequestMethod.ALL });

    consumer
      .apply(userMiddleware)
      .exclude({ path: 'auth/**', method: RequestMethod.ALL })
      .forRoutes({ path: 'anime/**', method: RequestMethod.ALL });
  }
}
