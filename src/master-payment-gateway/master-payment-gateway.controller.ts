
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common';
import { MasterPaymentGatewayService } from './master-payment-gateway.service';
import { CreateMasterPaymentGatewayDto } from './dto/create-master-payment-gateway.dto';
import { UpdateMasterPaymentGatewayDto } from './dto/update-master-payment-gateway.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('master-payment-gateway')
export class MasterPaymentGatewayController {
  constructor(private readonly masterPaymentGatewayService: MasterPaymentGatewayService) {}


  @Get()
  findAll() {
    return this.masterPaymentGatewayService.findAll();
  }


  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterPaymentGatewayService.findOne(id);
  }


  @Post()
  create(@Body() dto: CreateMasterPaymentGatewayDto, @Req() request: any) {
    const username = request.user?.username || 'system';
    return this.masterPaymentGatewayService.create(dto, username);
  }


  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMasterPaymentGatewayDto,
    @Req() request: any,
  ) {
    const username = request.user?.username || 'system';
    return this.masterPaymentGatewayService.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.masterPaymentGatewayService.remove(id);
  }
}
