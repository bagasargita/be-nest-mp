import { 
  Controller, Get, Post, Patch, Delete, Body, 
  Param, Query, UseGuards, Request, ParseUUIDPipe 
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RequirePermissions } from '../core/decorators/permission.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('menus')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('menu:read')
  async findAll(@Query('includeInactive') includeInactive: boolean) {
    return { 
      success: true,
      data: includeInactive 
        ? await this.menuService.findAllWithInactive() 
        : await this.menuService.findAll() 
    };
  }

  @Get('tree')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('menu:read')
  async getMenuTree() {
    return { 
      success: true,
      data: await this.menuService.getMenuTree() 
    };
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('menu:read')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.menuService.findOne(id)
    };
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('menu:create')
  async create(@Body() createMenuDto: CreateMenuDto, @Request() req) {
    return {
      success: true,
      data: await this.menuService.create(createMenuDto, req)
    };
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('menu:update')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @Request() req
  ) {
    return {
      success: true,
      data: await this.menuService.update(id, updateMenuDto, req)
    };
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('menu:delete')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    await this.menuService.softDelete(id, req);
    return {
      success: true,
      message: 'Menu deleted successfully'
    };
  }
}