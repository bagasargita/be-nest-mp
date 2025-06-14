import { User } from '../entities/user.entity';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User | null>;
  generateToken(user: User): Promise<string>;
  verifyToken(token: string): Promise<any>;
} 