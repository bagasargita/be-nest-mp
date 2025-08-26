import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req, // Untuk mengakses object request
} from '@nestjs/common';
import { AccountTypeService } from './accounttype.service';
import { CreateAccountTypeDto } from './dto/create-accounttype.dto';
import { UpdateAccountTypeDto } from './dto/update-accounttype.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('account-type')
export class AccountTypeController {
  constructor(private readonly service: AccountTypeService) {}

  @Get()
  findAll(){
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string){
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: CreateAccountTypeDto, @Req() request: any){
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.create(data, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() data: UpdateAccountTypeDto,
    @Req() request: any,
  ){
    const username = request.user.username || 'system'; // Ambil username dari request, default ke 'system'
    return this.service.update(id, data, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() request: any) {
    const username = request.user?.username || 'system';
    return this.service.remove(id, username);
  }
}