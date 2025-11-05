import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TransactionDeposit } from './entities/transaction-deposit.entity';
import { CreateTransactionDepositDto } from './dto/create-transaction-deposit.dto';
import { QueryTransactionDepositDto } from './dto/query-transaction-deposit.dto';
import { BackendExtService } from '../backend-ext/backend-ext.service';

@Injectable()
export class TransactionDepositService {
  private readonly logger = new Logger(TransactionDepositService.name);

  constructor(
    @InjectRepository(TransactionDeposit)
    private readonly repo: Repository<TransactionDeposit>,
    private readonly httpService: HttpService,
    private readonly backendExtService: BackendExtService,
  ) {}

  async findAll(queryDto: QueryTransactionDepositDto) {
    const { page = 1, limit = 10, machine_name, machine_id, start_date, end_date, transaction_status, sort, order, cdm_trx_no, code } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repo.createQueryBuilder('tx');

    // Filter by code
    if (code) {
      queryBuilder.andWhere('tx.code ILIKE :code', { 
        code: `%${code}%` 
      });
    }

    // Filter by CDM Transaction Number
    if (cdm_trx_no) {
      queryBuilder.andWhere('tx.cdm_trx_no ILIKE :cdmTrxNo', { 
        cdmTrxNo: `%${cdm_trx_no}%` 
      });
    }

    // Filter by machine name (from machine JSON)
    if (machine_name) {
      queryBuilder.andWhere("tx.machine->>'name' ILIKE :machineName", { 
        machineName: `%${machine_name}%` 
      });
    }

    // Filter by machine_id
    if (machine_id) {
      queryBuilder.andWhere('tx.machine_id = :machineId', { machineId: machine_id });
    }

    // Filter by transaction status
    if (transaction_status) {
      queryBuilder.andWhere('tx.transaction_status = :status', { status: transaction_status });
    }

    // Filter by date range
    if (start_date || end_date) {
      const start = start_date ? new Date(start_date) : new Date('1970-01-01');
      const end = end_date ? new Date(end_date + 'T23:59:59') : new Date();
      queryBuilder.andWhere('tx.cdm_trx_date BETWEEN :start AND :end', { start, end });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply sorting
    const sortField = sort || 'cdm_trx_date_time';
    const sortOrder = order || 'DESC';
    
    // Validate sort field to prevent SQL injection
    const allowedSortFields = [
      'code',
      'cdm_trx_no',
      'total_deposit',
      'charging_fee',
      'total_transfer',
      'transaction_status',
      'cdm_trx_date',
      'cdm_trx_time',
      'cdm_trx_date_time',
      'jam_posting',
      'created_at',
      'updated_at',
    ];
    
    const safeSortField = allowedSortFields.includes(sortField) ? sortField : 'cdm_trx_date_time';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Apply pagination and ordering
    const data = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy(`tx.${safeSortField}`, safeSortOrder)
      .getMany();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async syncFromExternalApi(configId?: string) {
    try {
      this.logger.log('🔄 Starting sync from external API...');

      // If configId not provided, find active config for transaction deposit API
      let targetConfigId = configId;
      if (!targetConfigId) {
        try {
          const activeConfigs = await this.backendExtService.getActiveConfigs();
          this.logger.log(`Found ${activeConfigs?.length || 0} active configs`);
          
          const depositConfig = activeConfigs?.find(
            config =>
              config.url?.includes('/trx/deposit/query') ||
              config.name?.toLowerCase().includes('deposit') ||
              config.name?.toLowerCase().includes('transaction'),
          );

          if (!depositConfig) {
            throw new HttpException(
              'Transaction Deposit API configuration not found. Please configure backend-ext first.',
              HttpStatus.BAD_REQUEST,
            );
          }

          targetConfigId = depositConfig.id;
          this.logger.log(`✅ Using config: ${depositConfig.name} (ID: ${targetConfigId})`);
        } catch (error) {
          this.logger.error('❌ Error finding config:', error);
          throw new HttpException(
            `Failed to find transaction deposit API configuration: ${error.message}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Get valid OAuth token
      let token: string;
      try {
        token = await this.backendExtService.getValidToken(targetConfigId, 'admin.internal.read admin.internal.create');
        this.logger.log('✅ Got valid OAuth token');
      } catch (error) {
        this.logger.error('❌ Error getting OAuth token:', error);
        throw new HttpException(
          `Failed to get OAuth token: ${error.message}`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      
      // Get config for base URL
      let config: any;
      try {
        config = await this.backendExtService.findOne(targetConfigId);
        this.logger.log(`✅ Got config with base_url: ${config.base_url}`);
      } catch (error) {
        this.logger.error('❌ Error getting config:', error);
        throw new HttpException(
          `Failed to get API configuration: ${error.message}`,
          HttpStatus.NOT_FOUND,
        );
      }
      
      const apiUrl = `${config.base_url}/api/cdt/core/trx/deposit/query`;
      this.logger.log(`🌐 Making request to: ${apiUrl}`);

      // Make API request
      let response: any;
      try {
        response = await firstValueFrom(
          this.httpService.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        );
        this.logger.log(`✅ API request successful, status: ${response.status}`);
      } catch (error) {
        this.logger.error('❌ Error making API request:', error);
        if (error.response) {
          this.logger.error(`Response status: ${error.response.status}`);
          this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        }
        throw new HttpException(
          `Failed to fetch from external API: ${error.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const transactions = Array.isArray(response.data) ? response.data : response.data?.data || [];
      
      this.logger.log(`📥 Received ${transactions.length} transactions from external API`);

      // Process and save transactions
      let created = 0;
      let updated = 0;
      let errors = 0;

      for (const tx of transactions) {
        try {
          if (!tx.code) {
            this.logger.warn('⚠️ Skipping transaction without code:', tx);
            errors++;
            continue;
          }

          const existingTx = await this.repo.findOne({
            where: { code: tx.code },
          });

          const txData: CreateTransactionDepositDto = {
            code: tx.code,
            total_deposit: tx.total_deposit || 0,
            charging_fee: tx.charging_fee || 0,
            total_transfer: tx.total_transfer || 0,
            transaction_status: tx.transaction_status || 'PENDING',
            machine_info: tx.machine_info || undefined,
            machine_id: tx.machine_id || undefined,
            cdm_trx_no: tx.cdm_trx_no || undefined,
            cdm_trx_date: tx.cdm_trx_date ? new Date(tx.cdm_trx_date) : undefined,
            cdm_trx_time: tx.cdm_trx_time || undefined,
            cdm_trx_date_time: tx.cdm_trx_date_time ? new Date(tx.cdm_trx_date_time) : undefined,
            jam_posting: tx.jam_posting ? new Date(tx.jam_posting) : undefined,
            denominations: tx.denominations || [],
            user: tx.user || undefined,
            customer: tx.customer || undefined,
            beneficiary_account: tx.beneficiary_account || undefined,
            machine: tx.machine || undefined,
            service_product: tx.service_product || undefined,
            pjpur_status: tx.pjpur_status || undefined,
            gateway_status: tx.gateway_status || undefined,
          };

          if (existingTx) {
            // Update existing
            await this.repo.update({ code: tx.code }, txData);
            updated++;
            this.logger.debug(`✅ Updated transaction: ${tx.code}`);
          } else {
            // Create new
            const newTx = this.repo.create(txData);
            await this.repo.save(newTx);
            created++;
            this.logger.debug(`✅ Created transaction: ${tx.code}`);
          }
        } catch (error) {
          this.logger.error(`❌ Error processing transaction ${tx?.code || 'unknown'}:`, error.message);
          this.logger.error('Error stack:', error.stack);
          errors++;
        }
      }

      this.logger.log(`✅ Sync completed: ${created} created, ${updated} updated, ${errors} errors`);

      return {
        success: true,
        message: 'Sync completed successfully',
        summary: {
          total: transactions.length,
          created,
          updated,
          errors,
        },
      };
    } catch (error) {
      this.logger.error('❌ Sync failed:', error);
      this.logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to sync from external API',
          error: error.message || 'Unknown error',
          details: error.response?.data || error.stack,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(dto: CreateTransactionDepositDto) {
    const existing = await this.repo.findOne({ where: { code: dto.code } });
    
    if (existing) {
      // Update existing
      await this.repo.update({ code: dto.code }, dto);
      return this.repo.findOne({ where: { code: dto.code } });
    }

    // Create new
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }
}

