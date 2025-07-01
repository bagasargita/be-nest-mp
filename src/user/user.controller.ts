import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/menus-permissions')
  @UseGuards(JwtAuthGuard)
  async getMyMenusAndPermissions(@Request() req) {
    const userId = req.user.id;
    return this.userService.getUserMenusAndPermissions(userId);
  }
}