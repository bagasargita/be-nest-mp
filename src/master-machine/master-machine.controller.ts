import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MasterMachineService } from './master-machine.service';
import { CreateMasterMachineDto } from './dto/create-master-machine.dto';
import { UpdateMasterMachineDto } from './dto/update-master-machine.dto';
import { JwtAuthGuard } from '../infrastructure/guards/auth.guard';

@ApiTags('Master Machine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master-machine')
export class MasterMachineController {
  constructor(private readonly masterMachineService: MasterMachineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new master machine' })
  async create(@Body() createDto: CreateMasterMachineDto, @Request() req) {
    const username = req.user?.username || req.user?.id || 'system';
    return {
      success: true,
      message: 'Master machine created successfully',
      data: await this.masterMachineService.create(createDto, username),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all master machines' })
  @ApiQuery({ name: 'account_id', required: false, description: 'Filter by account ID' })
  async findAll(@Query('account_id') accountId?: string) {
    if (accountId) {
      return {
        success: true,
        message: 'Master machines retrieved successfully',
        data: await this.masterMachineService.findByAccountId(accountId),
      };
    }
    return {
      success: true,
      message: 'Master machines retrieved successfully',
      data: await this.masterMachineService.findAll(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a master machine by ID' })
  async findOne(@Param('id') id: string) {
    const machine = await this.masterMachineService.findOne(id);
    if (!machine) {
      return {
        success: false,
        message: 'Master machine not found',
        data: null,
      };
    }
    return {
      success: true,
      message: 'Master machine retrieved successfully',
      data: machine,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a master machine' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMasterMachineDto,
    @Request() req,
  ) {
    const username = req.user?.username || req.user?.id || 'system';
    return {
      success: true,
      message: 'Master machine updated successfully',
      data: await this.masterMachineService.update(id, updateDto, username),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a master machine (soft delete)' })
  async remove(@Param('id') id: string, @Request() req) {
    const username = req.user?.username || req.user?.id || 'system';
    await this.masterMachineService.remove(id, username);
    return {
      success: true,
      message: 'Master machine deleted successfully',
    };
  }
}

