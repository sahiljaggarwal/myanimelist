import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<String>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<String>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<String>('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, displayName, emails } = profile;
    const user = {
      googleId: id,
      displayName,
      email: emails[0].value,
    };
    done(null, user);
  }
}
