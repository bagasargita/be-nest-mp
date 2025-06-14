import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { IAuthService } from '../../core/domain/interfaces/auth.service.interface';
import { IUserRepository } from '../../core/domain/interfaces/user.repository.interface';
import { User } from '../../core/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 