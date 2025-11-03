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
    const { page = 1, limit = 10, machine_name, machine_id, start_date, end_date, transaction_status } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repo.createQueryBuilder('tx');

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

    // Apply pagination and ordering
    const data = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('tx.cdm_trx_date_time', 'DESC')
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
        const activeConfigs = await this.backendExtService.getActiveConfigs();
        const depositConfig = activeConfigs.find(
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
      }

      // Get valid OAuth token
      const token = await this.backendExtService.getValidToken(targetConfigId, 'admin.internal.read admin.internal.create');
      
      // Get config for base URL
      const config = await this.backendExtService.findOne(targetConfigId);
      const apiUrl = `${config.base_url}/api/cdt/core/trx/deposit/query`;

      // Make API request
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const transactions = Array.isArray(response.data) ? response.data : response.data?.data || [];
      
      this.logger.log(`📥 Received ${transactions.length} transactions from external API`);

      // Process and save transactions
      let created = 0;
      let updated = 0;
      let errors = 0;

      for (const tx of transactions) {
        try {
          const existingTx = await this.repo.findOne({
            where: { code: tx.code },
          });

          const txData: CreateTransactionDepositDto = {
            code: tx.code,
            total_deposit: tx.total_deposit || 0,
            charging_fee: tx.charging_fee || 0,
            total_transfer: tx.total_transfer || 0,
            transaction_status: tx.transaction_status || 'PENDING',
            machine_info: tx.machine_info || null,
            machine_id: tx.machine_id || null,
            cdm_trx_no: tx.cdm_trx_no || null,
            cdm_trx_date: tx.cdm_trx_date ? new Date(tx.cdm_trx_date) : undefined,
            cdm_trx_time: tx.cdm_trx_time || undefined,
            cdm_trx_date_time: tx.cdm_trx_date_time ? new Date(tx.cdm_trx_date_time) : undefined,
            jam_posting: tx.jam_posting ? new Date(tx.jam_posting) : undefined,
            denominations: tx.denominations || [],
            user: tx.user || null,
            customer: tx.customer || null,
            beneficiary_account: tx.beneficiary_account || null,
            machine: tx.machine || null,
            service_product: tx.service_product || null,
            pjpur_status: tx.pjpur_status || null,
            gateway_status: tx.gateway_status || null,
          };

          if (existingTx) {
            // Update existing
            await this.repo.update({ code: tx.code }, txData);
            updated++;
          } else {
            // Create new
            const newTx = this.repo.create(txData);
            await this.repo.save(newTx);
            created++;
          }
        } catch (error) {
          this.logger.error(`❌ Error processing transaction ${tx.code}:`, error.message);
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
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to sync from external API',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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

