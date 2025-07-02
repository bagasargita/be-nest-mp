import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', { infer: true })!,
    });
  }

  async validate(payload: any) {
    // Perbaiki bagian ini untuk mengambil permission
    try {
      const user = await this.userService.getUserWithPermissions(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }
      
      return user;
    } catch (error) {
      console.error('Error in JWT validation:', error);
      throw new UnauthorizedException('Invalid authentication');
    }
  }
}