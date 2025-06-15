import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Req, ParseUUIDPipe } from '@nestjs/common';
import { AccountAddressService } from './account-address.service';
import { CreateAccountAddressDto } from './dto/create-account-address.dto';
import { UpdateAccountAddressDto } from './dto/update-account-address.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('account-address')
export class AccountAddressController {
  constructor(private readonly service: AccountAddressService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccountAddressDto, @Req() req: any) {
    const username = req.user.username;
    if (!username) {
      throw new Error('Username not found in request');
    }
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateAccountAddressDto,
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