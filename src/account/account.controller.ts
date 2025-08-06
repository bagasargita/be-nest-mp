import { 
  Query, Controller, Get, Post, Body, Param, Put, Patch, Delete, 
  ParseUUIDPipe, Req, UseInterceptors, UploadedFile, HttpStatus, Res,
  BadRequestException, UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody,
  ApiConsumes
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/guards/auth.guard';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdateAccountReferralDto } from './dto/update-account-referral.dto';
import { MassUploadAccountDto, MassUploadResultDto } from './dto/mass-upload-account.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('options')
  @ApiOperation({ summary: 'Get accounts for select options' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Account options retrieved successfully' })
  async getAccountOptions() {
    return this.service.getAccountOptions();
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

   @Get('lookup-data')
  @ApiOperation({ 
    summary: 'Get lookup data for CSV reference',
    description: 'Get available industries, type of business, account types, categories, and existing accounts for CSV reference.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lookup data retrieved successfully'
  })
  async getLookupData() {
    return this.service.getLookupData();
  }

  @Get('template/download')
  @ApiOperation({ 
    summary: 'Download CSV template for mass upload',
    description: 'Download a CSV template file with sample data and proper format for mass uploading accounts.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'CSV template file downloaded successfully',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  async downloadTemplate(@Res() res: Response): Promise<void> {
    try {
      const template = await this.service.generateTemplate();
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="account_upload_template.csv"');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(template);
    } catch (error) {
      console.error('Error generating template:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate template',
        error: 'Internal Server Error'
      });
    }
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

  @Post('mass-upload')
  @ApiOperation({ 
    summary: 'Mass upload accounts from CSV file',
    description: 'Upload a CSV file containing account data to create multiple accounts at once. Supports parent-child relationships, industries, type of business, account types, and categories.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file containing account data',
    type: MassUploadAccountDto,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with account data (max 10MB)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Mass upload completed successfully',
    type: MassUploadResultDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid file format or data validation errors'
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only CSV files are allowed'), false);
      }
    }
  }))
  async massUpload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ): Promise<MassUploadResultDto> {
    const username = req.user?.username || 'system';
    return this.service.massUpload(file, username);
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

  // Referral management endpoints
  @Get(':id/referrals')
  @ApiOperation({ summary: 'Get account referrals' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Referrals retrieved successfully' })
  async getAccountReferrals(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getAccountReferrals(id);
  }

  @Post(':id/referrals')
  @ApiOperation({ summary: 'Create account referrals' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Referrals created successfully' })
  async createAccountReferrals(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Body() body: { referral_account_ids: string[] },
    @Req() req: any
  ) {
    const username = req.user?.username || 'system';
    return this.service.createAccountReferrals(accountId, body.referral_account_ids, username);
  }

  @Put(':id/referrals/:referralId')
  @ApiOperation({ summary: 'Update account referral' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Referral updated successfully' })
  async updateAccountReferral(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Param('referralId', ParseUUIDPipe) referralId: string,
    @Body() dto: UpdateAccountReferralDto,
    @Req() req: any
  ) {
    const username = req.user?.username || 'system';
    return this.service.updateAccountReferral(referralId, dto, username);
  }

  @Delete(':id/referrals/:referralId')
  @ApiOperation({ summary: 'Delete account referral' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Referral deleted successfully' })
  async deleteAccountReferral(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Param('referralId', ParseUUIDPipe) referralId: string
  ) {
    return this.service.deleteAccountReferral(referralId);
  }

  // Commission Rate Endpoints
  @Post(':id/commission-rates')
  @ApiOperation({ summary: 'Create commission rate for account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Commission rate created successfully' })
  async createCommissionRate(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Body() commissionData: any,
    @Req() req: any
  ) {
    const username = req.user?.username || 'system';
    return this.service.createCommissionRate(accountId, commissionData, username);
  }

  @Get(':id/commission-rates')
  @ApiOperation({ summary: 'Get commission rates for account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Commission rates retrieved successfully' })
  async getCommissionRates(@Param('id', ParseUUIDPipe) accountId: string) {
    return this.service.getCommissionRates(accountId);
  }

  @Put('commission-rates/:commissionRateId')
  @ApiOperation({ summary: 'Update commission rate' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Commission rate updated successfully' })
  async updateCommissionRate(
    @Param('commissionRateId', ParseUUIDPipe) commissionRateId: string,
    @Body() updateData: any,
    @Req() req: any
  ) {
    const username = req.user?.username || 'system';
    return this.service.updateCommissionRate(commissionRateId, updateData, username);
  }

  @Delete('commission-rates/:commissionRateId')
  @ApiOperation({ summary: 'Delete commission rate' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Commission rate deleted successfully' })
  async deleteCommissionRate(@Param('commissionRateId', ParseUUIDPipe) commissionRateId: string) {
    return this.service.deleteCommissionRate(commissionRateId);
  }

  // Vendor Details Endpoints
  @Post(':id/vendor-details')
  @ApiOperation({ summary: 'Create or update vendor details for account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vendor details created/updated successfully' })
  async createOrUpdateVendorDetails(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Body() vendorData: any,
    @Req() req: any
  ) {
    const username = req.user?.username || 'system';
    return this.service.createOrUpdateVendorDetails(accountId, vendorData, username);
  }

  @Get(':id/vendor-details')
  @ApiOperation({ summary: 'Get vendor details for account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vendor details retrieved successfully' })
  async getVendorDetails(@Param('id', ParseUUIDPipe) accountId: string) {
    return this.service.getVendorDetails(accountId);
  }

  @Delete(':id/vendor-details')
  @ApiOperation({ summary: 'Delete vendor details for account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vendor details deleted successfully' })
  async deleteVendorDetails(@Param('id', ParseUUIDPipe) accountId: string) {
    return this.service.deleteVendorDetails(accountId);
  }
}