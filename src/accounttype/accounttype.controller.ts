import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AccountTypeService } from './accounttype.service';
import { AccountType } from './entities/accounttype.entity';
import { CreateAccountTypeDto } from './dto/create-accounttype.dto';
import { UpdateAccountTypeDto } from './dto/update-accounttype.dto';

@Controller('account-type')
export class AccountTypeController {
  constructor(private readonly service: AccountTypeService) {}

  @Get()
  findAll(): Promise<AccountType[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AccountType | null> {
    return this.service.findOne(id);
  }
  @Post()
  create(@Body() data: CreateAccountTypeDto): Promise<AccountType> {
    return this.service.create(data);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateAccountTypeDto): Promise<AccountType> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}