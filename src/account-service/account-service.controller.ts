import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common';
import { AccountServiceService } from './account-service.service';
import { CreateAccountServiceDto } from './dto/create-account-service.dto';
import { UpdateAccountServiceDto } from './dto/update-account-service.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('account-service')
export class AccountServiceController {
  constructor(private readonly service: AccountServiceService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get('account/:accountId')
  findByAccountId(@Param('accountId', ParseUUIDPipe) accountId: string) {
    if (!accountId) {
      throw new Error('Account ID parameter is required');
    }
    return this.service.findByAccountIdWithRelations(accountId);
  }

  @Post()
  create(@Body() createAccountServiceDto: CreateAccountServiceDto, @Req() req: any) {
    const username = req.user.username;
    if (!username) {
      throw new Error('Username not found in request');
    }
    return this.service.create(createAccountServiceDto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateAccountServiceDto: UpdateAccountServiceDto,
    @Req() req: any,
  ) {
    const username = req.user.username;
    if (!username) {
      throw new Error('Username not found in request');
    }
    return this.service.update(id, updateAccountServiceDto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    if (!id) {
      throw new Error('ID parameter is required');
    }
    return this.service.remove(id);
  }
}
