import { Query, Controller, Get, Post, Body, Param, Put, Patch, Delete, ParseUUIDPipe, Req } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/infrastructure/guards/auth.guard';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody  } from '@nestjs/swagger';

// @UseGuards(JwtAuthGuard)
@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('generate-account-no')
  async generateAccountNo(
    @Query('account_type_name') accountTypeName: string,
    @Query('parent_id') parentId?: string,
  ) {
    return this.service.generateAccountNo(accountTypeName, parentId);
  }

  @Get('parent-tree')
  async getParentAccountTree() {
    return this.service.getParentAccountTree();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAccountDto, @Req() req: any) {
    const username = req.user.username || 'system'; // Menggunakan ID user dari token JWT atau default ke 'system'
    return this.service.create(dto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateAccountDto, 
    @Req() req: any,
  ) {
    const username = req.user.username || 'system'; // Menggunakan ID user dari token JWT atau default ke 'system'
    return this.service.update(id, dto, username);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  // Endpoint untuk ambil seluruh subtree dari sebuah account
  @Get(':id/tree')
  findDescendants(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findDescendants(id);
  }
}