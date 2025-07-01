import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, Query, ParseUUIDPipe 
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';
import { PermissionsGuard } from '../core/guards/permissions.guard';
import { RequirePermissions } from '../core/decorators/permission.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('role:create')
  create(@Body() createRoleDto: CreateRoleDto, @Request() req) {
    return this.roleService.create(createRoleDto, req);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('role:read')
  findAll(@Query('includeInactive') includeInactive: boolean) {
    return includeInactive 
      ? this.roleService.findAllWithInactive() 
      : this.roleService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('role:read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('role:update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req
  ) {
    return this.roleService.update(id, updateRoleDto, req);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('role:delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.roleService.softDelete(id, req);
  }
}