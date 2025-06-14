import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../presentation/controllers/auth.controller';
import { AuthService } from '../infrastructure/services/auth.service';
import { JwtStrategy } from '../infrastructure/strategies/jwt.strategy';
import { User } from '../core/domain/entities/user.entity';
import { UserRepository } from '../infrastructure/repositories/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    {
      provide: 'IUserRepository',
      useExisting: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {} 