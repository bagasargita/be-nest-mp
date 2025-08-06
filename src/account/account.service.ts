import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository, Repository, DataSource } from 'typeorm';
import { Account } from './entities/account.entity';
import { AccountReferral } from './entities/account-referral.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountReferralDto } from './dto/create-account-referral.dto';
import { UpdateAccountReferralDto } from './dto/update-account-referral.dto';
import { MassUploadResultDto, AccountCsvRowDto, SuccessfulAccountDto } from './dto/mass-upload-account.dto';
import { AccountAddressService } from '../account-address/account-address.service';
import { AccountPICService } from '../account-pic/account-pic.service';
import { AccountBankService } from '../account-bank/account-bank.service';
import { TypeOfBusiness } from '../type-of-business/entities/type-of-business.entity';
import { Industry } from '../industry/entities/industry.entity';
import { AccountType } from '../accounttype/entities/accounttype.entity';
import { AccountCategory } from '../account-category/entities/account-category.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: TreeRepository<Account>,
    @InjectRepository(AccountReferral)
    private readonly accountReferralRepo: Repository<AccountReferral>,
    @InjectRepository(TypeOfBusiness)
    private readonly typeOfBusinessRepo: Repository<TypeOfBusiness>,
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
    @InjectRepository(AccountCategory)
    private readonly accountCategoryRepository: Repository<AccountCategory>,
    private readonly accountAddressService: AccountAddressService,
    private readonly accountPICService: AccountPICService,
    private readonly accountBankService: AccountBankService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Account[]> {
    const accounts = await this.repo.findTrees({
      relations: [
        'industry',
        'type_of_business',
        'type_of_business.parent',
        'account_type',
        'account_categories',
      ]
    });

    // Populate addresses, PICs, and banks for each account
    const accountsWithRelations = await Promise.all(
      accounts.map(async (account) => {
        const [addresses, pics, banks] = await Promise.all([
          this.accountAddressService.findByAccountId(account.id),
          this.accountPICService.findByAccountIdWithRelations(account.id), // gunakan relasi position
          this.accountBankService.findByAccountIdWithRelations(account.id) // gunakan relasi bank & bank_category
        ]);
        return {
          ...account,
          account_address: addresses || [],
          account_pic: pics || [],
          account_bank: banks || []
        };
      }),
    );
    return accountsWithRelations;
  }

  /**
   * Get accounts in a format suitable for select options
   */
  async getAccountOptions(): Promise<{ value: string; label: string; account_no: string }[]> {
    const accounts = await this.repo.find({
      select: ['id', 'account_no', 'name'],
      where: { is_active: true }
    });

    return accounts.map(account => ({
      value: account.id,
      label: `${account.account_no} - ${account.name}`,
      account_no: account.account_no
    }));
  }

  async generateAccountNo(accountTypeName: string, parentId?: string): Promise<{ account_no: string }> {
    const padSeq = (seq: number, len = 3) => String(seq).padStart(len, '0');
    const padSeq4 = (seq: number) => String(seq).padStart(4, '0');
    const today = new Date();
    const YY = String(today.getFullYear()).slice(-2);
    const MM = String(today.getMonth() + 1).padStart(2, '0');
    const DD = String(today.getDate()).padStart(2, '0');

    let accountNo = '';
    let sequence = 1;

    if (accountTypeName === 'parent') {
      // Format: YYMMDD-0001
      const prefix = `${YY}${MM}${DD}`;
      const count = await this.repo.createQueryBuilder("account")
        .where("account.account_no LIKE :prefix", { prefix: `${prefix}-%` })
        .andWhere("account.parentId IS NULL")
        .getCount();
      sequence = count + 1;
      accountNo = `${prefix}-${padSeq4(sequence)}`;
    } else if (['child', 'branch', 'sub-branch'].includes(accountTypeName)) {
      if (!parentId) throw new BadRequestException('parent_id is required');
      // Cari parent
      const parent = await this.repo.findOne({ where: { id: parentId } });
      if (!parent) throw new BadRequestException('Parent not found');
      // Hitung jumlah anak langsung parent ini
      const count = await this.repo.count({ where: { parent: { id: parentId } } });
      sequence = count + 1;
      accountNo = `${parent.account_no}-${padSeq(sequence)}`;
    } else {
      throw new BadRequestException('Invalid account_type_name');
    }

    return { account_no: accountNo };
  }

  async findOne(id: string): Promise<any> {
    const account = await this.repo.findOne({
      where: { id },
      relations: [
        'industry',
        'type_of_business',
        'type_of_business.parent',
        'account_type',
        'account_categories',
        'parent'
      ]
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // Ambil data terkait dengan relasi lengkap
    const [addresses, pics, banks, referrals] = await Promise.all([
      this.accountAddressService.findByAccountId(id),
      this.accountPICService.findByAccountIdWithRelations(id), // relasi position
      this.accountBankService.findByAccountIdWithRelations(id), // relasi bank & bank_category
      this.getAccountReferrals(id) // referral accounts
    ]);

    return {
      ...account,
      account_address: addresses || [],
      account_pic: pics || [],
      account_bank: banks || [],
      referral_accounts: referrals || []
    };
  }

  async create(dto: CreateAccountDto, username: string): Promise<Account> {
    let typeOfBusinessDetail = dto.type_of_business_detail;
    
    // If type_of_business_id is provided, auto-populate type_of_business_detail
    if (dto.type_of_business_id) {
      const typeOfBusiness = await this.typeOfBusinessRepo.findOne({
        where: { id: dto.type_of_business_id },
        relations: ['parent']
      });
      
      if (typeOfBusiness) {
        // If it's not an "Other" type, use the detail from type_of_business or the name
        if (!typeOfBusiness.is_other) {
          typeOfBusinessDetail = typeOfBusiness.detail || typeOfBusiness.name;
        }
        // If it's an "Other" type, use the provided type_of_business_detail
        // If no detail is provided for "Other", it will remain null/empty
      }
    }

    // Extract referral_account_ids from dto
    const { referral_account_ids, ...accountData } = dto;

    const entity = this.repo.create({
      ...accountData,
      type_of_business_detail: typeOfBusinessDetail,
      industry: dto.industry_id ? { id: dto.industry_id } : undefined,
      type_of_business: dto.type_of_business_id ? { id: dto.type_of_business_id } : undefined,
      account_type: dto.account_type_id ? { id: dto.account_type_id } : undefined,
      account_categories: dto.account_category_ids?.map(id => ({ id })) || [],
      parent: dto.parent_id ? { id: dto.parent_id } as any : null,
      created_by: username,
      created_at: new Date(),
    });
    
    const savedAccount = await this.repo.save(entity);

    // Handle referral accounts if provided
    if (referral_account_ids && referral_account_ids.length > 0) {
      await this.createAccountReferrals(savedAccount.id, referral_account_ids, username);
    }

    return savedAccount;
  }

  async update(id: string, dto: UpdateAccountDto, username: string): Promise<Account> {
    let typeOfBusinessDetail = dto.type_of_business_detail;
    
    // If type_of_business_id is provided, auto-populate type_of_business_detail
    if (dto.type_of_business_id) {
      const typeOfBusiness = await this.typeOfBusinessRepo.findOne({
        where: { id: dto.type_of_business_id },
        relations: ['parent']
      });
      
      if (typeOfBusiness) {
        // If it's not an "Other" type, use the detail from type_of_business or the name
        if (!typeOfBusiness.is_other) {
          typeOfBusinessDetail = typeOfBusiness.detail || typeOfBusiness.name;
        }
        // If it's an "Other" type, use the provided type_of_business_detail
        // If no detail is provided for "Other", it will remain null/empty
      }
    }

    // Extract referral_account_ids from dto
    const { referral_account_ids, ...accountData } = dto;

    const updateData: any = {
      ...accountData,
      type_of_business_detail: typeOfBusinessDetail,
      updated_by: username,
      updated_at: new Date(),
    };
    if (dto.industry_id) updateData.industry = { id: dto.industry_id };
    if (dto.type_of_business_id) updateData.type_of_business = { id: dto.type_of_business_id };
    if (dto.account_type_id) updateData.account_type = { id: dto.account_type_id };
    if (dto.account_category_ids) updateData.account_categories = dto.account_category_ids.map(id => ({ id }));
    if (dto.parent_id) updateData.parent = { id: dto.parent_id } as any;

    const account = await this.repo.preload({
      id: id,
      ...updateData,
    });
    if (!account) {
      throw new Error(`Account with id ${id} not found`);
    }

    const savedAccount = await this.repo.save(account);

    // Handle referral accounts update if provided
    if (referral_account_ids !== undefined) {
      // Remove existing referrals
      await this.accountReferralRepo.delete({ account_id: id });
      
      // Add new referrals if any
      if (referral_account_ids.length > 0) {
        await this.createAccountReferrals(id, referral_account_ids, username);
      }
    }

    return savedAccount;
  }

  async remove(id: string): Promise<void> {
    const account = await this.repo.delete({ id });
    if (!account) {
      throw new Error(`Account with id ${id} not found`);
    }
  }

  async findDescendants(id: string) {
    return this.repo.findDescendantsTree({ id } as Account);
  }

  async getParentAccountTree(): Promise<Account[]> {
    return this.repo.findTrees();
  }

  // ======================= MASS UPLOAD METHODS =======================

  /**
   * Mass upload accounts from CSV file
   */
  async massUpload(file: Express.Multer.File, username: string): Promise<MassUploadResultDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    const csvData = file.buffer.toString('utf-8');
    const rows = this.parseCsv(csvData);
    
    if (rows.length === 0) {
      throw new BadRequestException('CSV file is empty or invalid');
    }

    const result: MassUploadResultDto = {
      totalRows: rows.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
      successfulAccounts: [],
      warnings: []
    };

    // Cache for lookup data to improve performance
    const caches = await this.buildLookupCaches();

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const rowIndex = i + 2; // +2 because CSV starts at row 1 and we skip header
      const row = rows[i];

      try {
        await this.processAccountRow(row, rowIndex, caches, result, username);
      } catch (error) {
        result.errorCount++;
        result.errors.push(`Row ${rowIndex}: ${error.message}`);
        console.error(`Error processing row ${rowIndex}:`, error);
      }
    }

    return result;
  }

  /**
   * Parse CSV data into account row objects
   */
  private parseCsv(csvData: string): AccountCsvRowDto[] {
    const lines = csvData
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));
    
    if (lines.length < 2) {
      throw new BadRequestException('CSV must have at least a header and one data row');
    }

    // Parse headers
    const headers = this.parseCsvLine(lines[0]);
    
    // Validate headers
    this.validateCsvHeaders(headers);

    const rows: AccountCsvRowDto[] = [];

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const row: any = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header === 'is_active') {
          row[header] = value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
        } else {
          row[header] = value.trim() || null;
        }
      });

      // Skip empty rows
      if (row.name && row.name.trim()) {
        rows.push(row as AccountCsvRowDto);
      }
    }

    return rows;
  }

  /**
   * Get available lookup data for CSV reference
   */
  async getLookupData() {
    const [industries, typeOfBusinesses, accountTypes, accountCategories, accounts] = await Promise.all([
      this.industryRepository.find({ 
        where: { is_active: true },
        select: ['id', 'name'],
        order: { name: 'ASC' }
      }),
      this.typeOfBusinessRepo.find({ 
        where: { is_active: true },
        select: ['id', 'name', 'is_other', 'detail'],
        relations: ['parent'],
        order: { name: 'ASC' }
      }),
      this.accountTypeRepository.find({ 
        where: { is_active: true },
        select: ['id', 'name'],
        order: { name: 'ASC' }
      }),
      this.accountCategoryRepository.find({ 
        where: { is_active: true },
        select: ['id', 'name'],
        order: { name: 'ASC' }
      }),
      this.repo.find({ 
        where: { is_active: true },
        select: ['id', 'name'],
        order: { name: 'ASC' }
      })
    ]);

    return {
      industries,
      typeOfBusinesses,
      accountTypes,
      accountCategories,
      accounts
    };
  }

  // ======================= HELPER METHODS =======================

  /**
   * Build lookup caches for mass upload processing
   */
  private async buildLookupCaches() {
    const [industries, typeOfBusinesses, accountTypes, accountCategories, existingAccounts] = await Promise.all([
      this.industryRepository.find({ where: { is_active: true } }),
      this.typeOfBusinessRepo.find({ 
        where: { is_active: true },
        relations: ['parent']
      }),
      this.accountTypeRepository.find({ where: { is_active: true } }),
      this.accountCategoryRepository.find({ where: { is_active: true } }),
      this.repo.find({ where: { is_active: true }, select: ['id', 'name'] })
    ]);

    return {
      industries: new Map(industries.map(item => [item.name.toLowerCase(), item])),
      typeOfBusinesses: new Map(typeOfBusinesses.map(item => [item.name.toLowerCase(), item])),
      accountTypes: new Map(accountTypes.map(item => [item.name.toLowerCase(), item])),
      accountCategories: new Map(accountCategories.map(item => [item.name.toLowerCase(), item])),
      existingAccounts: new Map(existingAccounts.map(item => [item.name.toLowerCase(), item])),
      newAccountsInBatch: new Map() // Track accounts created in current batch
    };
  }

  /**
   * Parse CSV line handling quotes and commas properly
   */
  private parseCsvLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        values.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    // Add the last field
    values.push(current.trim());
    
    return values;
  }

  /**
   * Validate CSV headers
   */
  private validateCsvHeaders(headers: string[]): void {
    const requiredHeaders = ['name'];
    const validHeaders = [
      'name', 'brand_name', 'parent_account_name', 'industry_name',
      'type_of_business_name', 'type_of_business_detail', 'account_type_name',
      'account_category_names', 'is_active'
    ];

    // Check required headers
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new BadRequestException(`Missing required header: ${required}`);
      }
    }

    // Check for invalid headers
    const invalidHeaders = headers.filter(header => !validHeaders.includes(header));
    if (invalidHeaders.length > 0) {
      throw new BadRequestException(`Invalid headers: ${invalidHeaders.join(', ')}. Valid headers: ${validHeaders.join(', ')}`);
    }
  }

  /**
   * Process a single account row
   */
  private async processAccountRow(
    row: AccountCsvRowDto,
    rowIndex: number,
    caches: any,
    result: MassUploadResultDto,
    username: string
  ): Promise<void> {
    // Validate required fields
    if (!row.name || row.name.trim() === '') {
      throw new Error('Account name is required');
    }

    const accountName = row.name.trim();

    // Check if account already exists
    if (caches.existingAccounts.has(accountName.toLowerCase()) || 
        caches.newAccountsInBatch.has(accountName.toLowerCase())) {
      throw new Error(`Account with name '${accountName}' already exists or duplicated in this upload`);
    }

    // Build account data
    const accountData: any = {
      name: accountName,
      brand_name: row.brand_name?.trim() || null,
      is_active: row.is_active !== undefined ? row.is_active : true
    };

    // Handle parent account
    if (row.parent_account_name?.trim()) {
      const parentName = row.parent_account_name.trim().toLowerCase();
      const parentAccount = caches.existingAccounts.get(parentName) || 
                           caches.newAccountsInBatch.get(parentName);
      
      if (!parentAccount) {
        throw new Error(`Parent account '${row.parent_account_name}' not found. Make sure parent accounts are created first or exist in the system.`);
      }
      accountData.parent_id = parentAccount.id;
    }

    // Handle industry
    if (row.industry_name?.trim()) {
      const industry = caches.industries.get(row.industry_name.trim().toLowerCase());
      if (!industry) {
        throw new Error(`Industry '${row.industry_name}' not found. Available industries: ${Array.from(caches.industries.keys()).join(', ')}`);
      }
      accountData.industry_id = industry.id;
    }

    // Handle type of business
    if (row.type_of_business_name?.trim()) {
      const typeOfBusiness = caches.typeOfBusinesses.get(row.type_of_business_name.trim().toLowerCase());
      if (!typeOfBusiness) {
        throw new Error(`Type of business '${row.type_of_business_name}' not found. Available types: ${Array.from(caches.typeOfBusinesses.keys()).join(', ')}`);
      }
      
      accountData.type_of_business_id = typeOfBusiness.id;
      
      // Handle type of business detail
      if (typeOfBusiness.is_other) {
        if (!row.type_of_business_detail?.trim()) {
          throw new Error(`Type of business detail is required when using 'Other' type (${row.type_of_business_name})`);
        }
        accountData.type_of_business_detail = row.type_of_business_detail.trim();
      } else {
        // Use predefined detail or the type name
        accountData.type_of_business_detail = typeOfBusiness.detail || typeOfBusiness.name;
        
        // Add warning if user provided detail for non-Other type
        if (row.type_of_business_detail?.trim()) {
          result.warnings.push(`Row ${rowIndex}: type_of_business_detail ignored for non-Other type '${typeOfBusiness.name}'`);
        }
      }
    }

    // Handle account type
    if (row.account_type_name?.trim()) {
      const accountType = caches.accountTypes.get(row.account_type_name.trim().toLowerCase());
      if (!accountType) {
        throw new Error(`Account type '${row.account_type_name}' not found. Available types: ${Array.from(caches.accountTypes.keys()).join(', ')}`);
      }
      accountData.account_type_id = accountType.id;
    }

    // Handle account categories
    if (row.account_category_names?.trim()) {
      const categoryNames = row.account_category_names
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      const categoryIds: string[] = [];
      const invalidCategories: string[] = [];
      
      for (const categoryName of categoryNames) {
        const category = caches.accountCategories.get(categoryName.toLowerCase());
        if (category) {
          categoryIds.push(category.id);
        } else {
          invalidCategories.push(categoryName);
        }
      }
      
      if (invalidCategories.length > 0) {
        throw new Error(`Account categories not found: ${invalidCategories.join(', ')}. Available categories: ${Array.from(caches.accountCategories.keys()).join(', ')}`);
      }
      
      if (categoryIds.length > 0) {
        accountData.account_category_ids = categoryIds;
      }
    }

    // Generate account number using existing method
    let accountNo = '';
    try {
      if (accountData.parent_id) {
        // Child account
        const accountTypeEntry = caches.accountTypes.get(row.account_type_name?.toLowerCase() || '');
        const accountTypeName = accountTypeEntry?.name?.toLowerCase() || 'child';
        const { account_no } = await this.generateAccountNo(accountTypeName, accountData.parent_id);
        accountNo = account_no;
      } else {
        // Parent account
        const { account_no } = await this.generateAccountNo('parent');
        accountNo = account_no;
      }
    } catch (error) {
      // Fallback account number generation
      const timestamp = Date.now().toString().slice(-6);
      accountNo = `ACC${timestamp}`;
    }

    accountData.account_no = accountNo;

    // Create the account using transaction for data integrity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create DTO for the create method
      const createDto: CreateAccountDto = {
        ...accountData,
        account_no: accountNo
      };

      // Use existing create method to maintain consistency
      const savedAccount = await this.create(createDto, username);

      await queryRunner.commitTransaction();

      // Add to cache for future parent lookups in the same batch
      caches.newAccountsInBatch.set(savedAccount.name.toLowerCase(), savedAccount);

      // Record success
      result.successCount++;
      result.successfulAccounts.push({
        row: rowIndex,
        account: {
          id: savedAccount.id,
          name: savedAccount.name,
          brand_name: savedAccount.brand_name,
          account_no: savedAccount.account_no
        }
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Generate CSV template for mass upload
   */
  async generateTemplate(): Promise<string> {
    const headers = [
      'name',
      'brand_name',
      'parent_account_name',
      'industry_name',
      'type_of_business_name',
      'type_of_business_detail',
      'account_type_name',
      'account_category_names',
      'is_active'
    ];

    // Get sample data from database for reference
    const [industries, typeOfBusinesses, accountTypes, accountCategories] = await Promise.all([
      this.industryRepository.find({ where: { is_active: true }, take: 3 }),
      this.typeOfBusinessRepo.find({ where: { is_active: true }, take: 3 }),
      this.accountTypeRepository.find({ where: { is_active: true }, take: 3 }),
      this.accountCategoryRepository.find({ where: { is_active: true }, take: 3 })
    ]);

    const sampleData = [
      [
        'PT ABC Technology',
        'ABC Tech',
        '', // no parent
        industries[0]?.name || 'Technology',
        typeOfBusinesses[0]?.name || 'Corporate',
        '', // will be auto-filled if not Other type
        accountTypes[0]?.name || 'parent',
        accountCategories.slice(0, 2).map(cat => cat.name).join(',') || 'Customer',
        'true'
      ],
      [
        'PT XYZ Solutions',
        'XYZ Solutions',
        'PT ABC Technology', // child of ABC Technology
        industries[1]?.name || 'Technology',
        typeOfBusinesses[1]?.name || 'Corporate',
        '',
        accountTypes[1]?.name || 'child',
        accountCategories[2]?.name || 'Customer',
        'true'
      ],
      [
        'PT Custom Business',
        'Custom Biz',
        '',
        industries[2]?.name || 'Technology',
        'Other', // example of Other type
        'Custom financial services provider', // required for Other type
        accountTypes[0]?.name || 'parent',
        'Premium',
        'true'
      ]
    ];

    // Build CSV content
    let csv = headers.map(h => `"${h}"`).join(',') + '\n';
    
    // Add comment lines explaining the format
    csv += '# Sample data below - replace with your actual data\n';
    csv += '# Required field: name\n';
    csv += '# For type_of_business_detail: only required when type_of_business_name is "Other"\n';
    csv += '# Multiple account_category_names should be comma-separated\n';
    csv += '# is_active: true/false, 1/0, yes/no (default: true)\n';
    csv += '# Parent accounts must be created before child accounts\n';
    
    sampleData.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }

  // ======================= ACCOUNT REFERRAL METHODS =======================

  /**
   * Create multiple account referrals
   */
  async createAccountReferrals(accountId: string, referralAccountIds: string[], username: string): Promise<void> {
    const referrals = referralAccountIds.map(referralAccountId => 
      this.accountReferralRepo.create({
        account_id: accountId,
        referral_account_id: referralAccountId,
        created_by: username,
        is_active: true,
      })
    );

    await this.accountReferralRepo.save(referrals);
  }

  /**
   * Get account referrals by account ID
   */
  async getAccountReferrals(accountId: string): Promise<AccountReferral[]> {
    return this.accountReferralRepo.find({
      where: { account_id: accountId, is_active: true },
      relations: ['referral_account'],
    });
  }

  /**
   * Create a single account referral
   */
  async createAccountReferral(dto: CreateAccountReferralDto, username: string): Promise<AccountReferral> {
    const referral = this.accountReferralRepo.create({
      ...dto,
      created_by: username,
    });

    return this.accountReferralRepo.save(referral);
  }

  /**
   * Update account referral
   */
  async updateAccountReferral(id: string, dto: UpdateAccountReferralDto, username: string): Promise<AccountReferral> {
    const referral = await this.accountReferralRepo.preload({
      id,
      ...dto,
      updated_by: username,
    });

    if (!referral) {
      throw new NotFoundException(`Account referral with ID ${id} not found`);
    }

    return this.accountReferralRepo.save(referral);
  }

  /**
   * Delete account referral
   */
  async deleteAccountReferral(id: string): Promise<void> {
    const result = await this.accountReferralRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Account referral with ID ${id} not found`);
    }
  }

  /**
   * Get accounts that were referred by a specific account
   */
  async getAccountsReferredBy(referralAccountId: string): Promise<AccountReferral[]> {
    return this.accountReferralRepo.find({
      where: { referral_account_id: referralAccountId, is_active: true },
      relations: ['account'],
    });
  }
}