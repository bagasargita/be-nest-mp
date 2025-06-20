import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Req, ParseUUIDPipe } from '@nestjs/common';
import { AccountBankService } from './account-bank.service';
import { CreateAccountBankDto } from './dto/create-account-bank.dto';
import { UpdateAccountBankDto } from './dto/update-account-bank.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('account-bank')
export class AccountBankController {
  constructor(private readonly service: AccountBankService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccountBankDto, @Req() req: any) {
    const username = req.user.username;
    if (!username) {
      throw new Error('Username not found in request');
    }
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateAccountBankDto,
    @Req() req: any,
  ) {
    const username = req.user.username;
    if (!username) {
      throw new Error('Username not found in request');
    }
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    if (!id) {
      throw new Error('ID parameter is required');
    }
    return this.service.remove(id);
  }
}