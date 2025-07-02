import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, Query, ParseUUIDPipe 
} from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RequirePermissions } from '../core/decorators/permission.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ProfileDto } from './dto/profile-user.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:create')
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userService.create(createUserDto, req.user.username);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:read')
  findAll(@Query() filterUserDto: FilterUserDto) {
    return this.userService.findAll(filterUserDto);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    const userId = req.user.id;
    return this.userService.getUserProfile(userId);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @Body() profileDto: ProfileDto,
    @Request() req
  ) {
    return this.userService.updateUserProfile(
      req.user.id,
      profileDto,
      req.user.username
    );
  }

  @Get('me/menus-permissions')
  @UseGuards(JwtAuthGuard)
  async getMyMenusAndPermissions(@Request() req) {
    const userId = req.user.id;
    return this.userService.getUserMenusAndPermissions(userId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() passwordData: { currentPassword: string; newPassword: string },
    @Request() req
  ) {
    return this.userService.changePassword(
      req.user.id,
      passwordData.currentPassword,
      passwordData.newPassword
    );
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:update')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    return this.userService.update(id, updateUserDto, req.user.username);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.userService.remove(id, req.user.username);
  }
}