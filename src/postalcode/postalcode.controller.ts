import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req, Query, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { PostalcodeService } from './postalcode.service';
import { CreatePostalcodeDto } from './dto/create-postalcode.dto';
import { UpdatePostalcodeDto } from './dto/update-postalcode.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@ApiTags('postalcode')
@ApiBearerAuth()
@Controller('postalcode')
export class PostalcodeController {
  constructor(private readonly postalcodeService: PostalcodeService) {}

  @Get()
 @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postalcodeService.findAll(limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { 
    return this.postalcodeService.findOne(Number(id));
  }

  @Post()
  create(@Body() createPostalcodeDto: CreatePostalcodeDto, @Req() request: any) {
    const username = request.user.username || 'system';
    return this.postalcodeService.create(createPostalcodeDto, username);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostalcodeDto: UpdatePostalcodeDto, 
    @Req() request: any,
  ) {
    const username = request.user.username || 'system';
    return this.postalcodeService.update(Number(id), updatePostalcodeDto, username);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postalcodeService.remove(Number(id));
  }

  @Get('search/:query')
  search(@Param('query') query: string) {
    return this.postalcodeService.search(query);
  }

  // Get unique countries
  @Get('hierarchy/countries')
  @ApiOperation({ summary: 'Get all unique countries' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  getCountries() {
    return this.postalcodeService.getCountries();
  }

  // Get provinces by country
  @Get('hierarchy/provinces')
  @ApiOperation({ summary: 'Get provinces by country' })
  @ApiQuery({ name: 'country', description: 'Country name', required: true })
  @ApiResponse({ status: 200, description: 'List of provinces' })
  getProvinces(@Query('country') country: string) {
    return this.postalcodeService.getProvinces(country);
  }

  // Get cities by province and country
  @Get('hierarchy/cities')
  @ApiOperation({ summary: 'Get cities by country and province' })
  @ApiQuery({ name: 'country', description: 'Country name', required: true })
  @ApiQuery({ name: 'province', description: 'Province name', required: true })
  @ApiResponse({ status: 200, description: 'List of cities' })
  getCities(
    @Query('country') country: string,
    @Query('province') province: string,
  ) {
    return this.postalcodeService.getCities(country, province);
  }

  // Get districts by city, province, and country
  @Get('hierarchy/districts')
  @ApiOperation({ summary: 'Get districts by country, province, and city' })
  @ApiQuery({ name: 'country', description: 'Country name', required: true })
  @ApiQuery({ name: 'province', description: 'Province name', required: true })
  @ApiQuery({ name: 'city', description: 'City name', required: true })
  @ApiResponse({ status: 200, description: 'List of districts' })
  getDistricts(
    @Query('country') country: string,
    @Query('province') province: string,
    @Query('city') city: string,
  ) {
    return this.postalcodeService.getDistricts(country, province, city);
  }

  // Get sub-districts by district, city, province, and country
  @Get('hierarchy/sub-districts')
  @ApiOperation({ summary: 'Get sub-districts by country, province, city, and district' })
  @ApiQuery({ name: 'country', description: 'Country name', required: true })
  @ApiQuery({ name: 'province', description: 'Province name', required: true })
  @ApiQuery({ name: 'city', description: 'City name', required: true })
  @ApiQuery({ name: 'district', description: 'District name', required: true })
  @ApiResponse({ status: 200, description: 'List of sub-districts' })
  getSubDistricts(
    @Query('country') country: string,
    @Query('province') province: string,
    @Query('city') city: string,
    @Query('district') district: string,
  ) {
    return this.postalcodeService.getSubDistricts(country, province, city, district);
  }

  // Get postal codes by complete address hierarchy
  @Get('hierarchy/postal-codes')
  @ApiOperation({ summary: 'Get postal codes by complete address hierarchy' })
  @ApiQuery({ name: 'country', description: 'Country name', required: true })
  @ApiQuery({ name: 'province', description: 'Province name', required: true })
  @ApiQuery({ name: 'city', description: 'City name', required: true })
  @ApiQuery({ name: 'district', description: 'District name', required: true })
  @ApiQuery({ name: 'subDistrict', description: 'Sub-district name', required: true })
  @ApiResponse({ status: 200, description: 'List of postal codes' })
  getPostalCodes(
    @Query('country') country: string,
    @Query('province') province: string,
    @Query('city') city: string,
    @Query('district') district: string,
    @Query('subDistrict') subDistrict: string,
  ) {
    return this.postalcodeService.getPostalCodes(country, province, city, district, subDistrict);
  }

  // Export postal codes to CSV
  @Get('export/csv')
  @ApiOperation({ summary: 'Export postal codes to CSV' })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'province', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'postal_code', required: false })
  async exportCsv(
    @Query() filters: any,
    @Res() res: Response,
  ) {
    const csv = await this.postalcodeService.exportToCsv(filters);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename=postal_codes_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  }

  // Import postal codes from CSV
  @Post('import/csv')
  @ApiOperation({ summary: 'Import postal codes from CSV' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const username = req.user?.username || 'system';
    return this.postalcodeService.importFromCsv(file, username);
  }
}
