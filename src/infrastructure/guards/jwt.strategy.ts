import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default_jwt_secret'),
    });
  }

  async validate(payload: any) {
    // Get full user info with permissions
    const userId = payload.sub;
    
    try {
      // Get user permissions and menus
      const userWithPermissions = await this.userService.getUserWithPermissions(userId);

      if (
        userWithPermissions !== undefined &&
        userWithPermissions !== null &&
        (userWithPermissions as any).roles &&
        (userWithPermissions as any).permissions
      ) {
        // Return user with permissions attached
        return {
          id: payload.sub,
          username: payload.username,
          roles: (userWithPermissions as any).roles,
          permissions: (userWithPermissions as any).permissions
        };
      } else {
        // Return basic user info without permissions if userWithPermissions is undefined
        return {
          id: payload.sub,
          username: payload.username
        };
      }
    } catch (error) {
      console.error('Error loading user permissions:', error);
      // Return basic user info without permissions
      return {
        id: payload.sub,
        username: payload.username
      };
    }
  }
}