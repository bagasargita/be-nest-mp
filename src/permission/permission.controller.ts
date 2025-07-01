import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, Query, ParseUUIDPipe 
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RequirePermissions } from '../core/decorators/permission.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('permission:create')
  create(@Body() createPermissionDto: CreatePermissionDto, @Request() req) {
    return this.permissionService.create(createPermissionDto, req);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('permission:read')
  findAll(@Query('includeInactive') includeInactive: boolean) {
    return includeInactive 
      ? this.permissionService.findAllWithInactive() 
      : this.permissionService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('permission:read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('permission:update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Request() req
  ) {
    return this.permissionService.update(id, updatePermissionDto, req);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('permission:delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.permissionService.softDelete(id, req);
  }
}