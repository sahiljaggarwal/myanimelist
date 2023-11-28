import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    console.log(req.headers);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const secretKey = this.configService.get<string>('secretKey');
      const decoded = this.jwtService.verify(token, { secret: secretKey });

      req['user'] = decoded;
      console.log(req['user']);
      next();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
