import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { 
  Repository, 
  DataSource, 
  In,
  FindOptionsWhere,
  FindOptionsRelations,
  FindManyOptions
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Entities
import { SettlementMethod } from './settlement-method.entity';
import { NonCashMethod } from './non-cash-method.entity';
import { CashDepositMethod } from './cash-deposit-method.entity';
import { SendMoneyMethod } from './send-money-method.entity';
import { SendGoodsMethod } from './send-good-method.entity';
import { BatchingDetail } from './batching-detail.entity';

// DTOs
import { CreateSettlementMethodDto } from './dto/create.dto';
import { UpdateSettlementMethodDto } from './dto/update.dto';
import { CreateCashDepositMethodDto, UpdateCashDepositMethodDto } from './dto/cash-deposit-method.dto';
import { CreateNonCashMethodDto, UpdateNonCashMethodDto } from './dto/non-cash-method.dto';
import { CreateSendMoneyMethodDto, UpdateSendMoneyMethodDto } from './dto/send-money-method.dto';
import { CreateSendGoodsMethodDto, UpdateSendGoodsMethodDto } from './dto/send-goods-method.dto';
import { CreateBatchingDetailDto, UpdateBatchingDetailDto } from './dto/batching-detail.dto';

type Entity = 
  | SettlementMethod 
  | CashDepositMethod 
  | NonCashMethod 
  | SendMoneyMethod 
  | SendGoodsMethod
  | BatchingDetail;

type EntityName = 
  | 'settlementMethod' 
  | 'cashDepositMethod' 
  | 'nonCashMethod' 
  | 'sendMoneyMethod' 
  | 'sendGoodsMethod'
  | 'batchingDetail';

const entityRelations: Record<EntityName, string[]> = {
  settlementMethod: ['cashDepositMethods', 'nonCashMethods', 'sendMoneyMethods', 'sendGoodsMethods'],
  cashDepositMethod: ['settlementMethod', 'batchingDetail'],
  nonCashMethod: ['settlementMethod'],
  sendMoneyMethod: ['settlementMethod'],
  sendGoodsMethod: ['settlementMethod'],
  batchingDetail: []
};

@Injectable()
export class SettlementMethodService {
  constructor(
    @InjectRepository(SettlementMethod)
    private readonly settlementMethodRepository: Repository<SettlementMethod>,
    @InjectRepository(CashDepositMethod)
    private readonly cashDepositMethodRepository: Repository<CashDepositMethod>,
    @InjectRepository(NonCashMethod)
    private readonly nonCashMethodRepository: Repository<NonCashMethod>,
    @InjectRepository(SendMoneyMethod)
    private readonly sendMoneyMethodRepository: Repository<SendMoneyMethod>,
    @InjectRepository(SendGoodsMethod)
    private readonly sendGoodsMethodRepository: Repository<SendGoodsMethod>,
    @InjectRepository(BatchingDetail)
    private readonly batchingDetailRepository: Repository<BatchingDetail>,
    private dataSource: DataSource,
  ) {}

  // ========== Helper Methods ==========
  
  private getRepository(entityName: EntityName): Repository<any> {
    const repositories = {
      settlementMethod: this.settlementMethodRepository,
      cashDepositMethod: this.cashDepositMethodRepository,
      nonCashMethod: this.nonCashMethodRepository,
      sendMoneyMethod: this.sendMoneyMethodRepository,
      sendGoodsMethod: this.sendGoodsMethodRepository,
      batchingDetail: this.batchingDetailRepository,
    };
    return repositories[entityName];
  }

  private async findEntityOrFail<T>(
    entityName: EntityName,
    id: number,
    relations: string[] = []
  ): Promise<T> {
    const repository = this.getRepository(entityName);
    const entity = await repository.findOne({
      where: { id } as any,
      relations,
    });
    
    if (!entity) {
      throw new NotFoundException(`${this.formatEntityName(entityName)} with ID ${id} not found`);
    }
    
    return entity as T;
  }

  private formatEntityName(entityName: string): string {
    return entityName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // ========== Settlement Method CRUD ==========

  async create(createDto: CreateSettlementMethodDto): Promise<SettlementMethod> {
    const settlementMethod = this.settlementMethodRepository.create(createDto);
    return this.settlementMethodRepository.save(settlementMethod);
  }

  async findAllSettlementMethods(): Promise<SettlementMethod[]> {
    return this.settlementMethodRepository.find({
      relations: entityRelations.settlementMethod,
    });
  }

  async findOneSettlementMethod(id: number): Promise<SettlementMethod> {
    return this.findEntityOrFail<SettlementMethod>(
      'settlementMethod',
      id,
      entityRelations.settlementMethod
    );
  }

  async updateSettlementMethod(
    id: number,
    updateDto: UpdateSettlementMethodDto,
  ): Promise<SettlementMethod> {
    const settlementMethod = await this.findOneSettlementMethod(id);
    Object.assign(settlementMethod, updateDto);
    return this.settlementMethodRepository.save(settlementMethod);
  }

  async removeSettlementMethod(id: number): Promise<void> {
    const result = await this.settlementMethodRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Settlement method with ID ${id} not found`);
    }
  }

  // ========== Cash Deposit Method CRUD ==========
  
  async createCashDepositMethod(createDto: CreateCashDepositMethodDto): Promise<CashDepositMethod> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Verify settlement method exists
      const settlementMethod = await this.settlementMethodRepository.findOne({
        where: { id: createDto.settlementMethodId }
      });
      
      if (!settlementMethod) {
        throw new NotFoundException(`Settlement method with ID ${createDto.settlementMethodId} not found`);
      }
      
      // Create batching detail if provided
      let batchingDetail: BatchingDetail | undefined;
      if (createDto.type === 'ByBatching' && createDto.batchingDetail) {
        batchingDetail = this.batchingDetailRepository.create(createDto.batchingDetail);
        await this.batchingDetailRepository.save(batchingDetail);
      } else if (createDto.type === 'ByBatching' && !createDto.batchingDetail) {
        throw new BadRequestException('Batching detail is required for ByBatching type');
      }
      
      // Create cash deposit method
      const cashDepositMethod = this.cashDepositMethodRepository.create({
        type: createDto.type,
        settlementMethod,
        batchingDetail
      });
      
      const result = await this.cashDepositMethodRepository.save(cashDepositMethod);
      
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllCashDepositMethods(): Promise<CashDepositMethod[]> {
    return this.cashDepositMethodRepository.find({
      relations: entityRelations.cashDepositMethod,
    });
  }

  async findOneCashDepositMethod(id: number): Promise<CashDepositMethod> {
    return this.findEntityOrFail<CashDepositMethod>(
      'cashDepositMethod',
      id,
      entityRelations.cashDepositMethod
    );
  }

  async updateCashDepositMethod(
    id: number,
    updateDto: UpdateCashDepositMethodDto,
  ): Promise<CashDepositMethod> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const cashDepositMethod = await this.findOneCashDepositMethod(id);
      
      // Update basic fields
      if (updateDto.type !== undefined) {
        cashDepositMethod.type = updateDto.type;
      }
      
      // Update settlement method if provided
      if (updateDto.settlementMethodId) {
        const settlementMethod = await this.settlementMethodRepository.findOne({
          where: { id: updateDto.settlementMethodId }
        });
        
        if (!settlementMethod) {
          throw new NotFoundException(`Settlement method with ID ${updateDto.settlementMethodId} not found`);
        }
        
        cashDepositMethod.settlementMethod = settlementMethod;
      }
      
      // Handle batching detail updates
      if (updateDto.batchingDetail) {
        if (!cashDepositMethod.batchingDetail) {
          // Create new batching detail if it doesn't exist
          const batchingDetail = this.batchingDetailRepository.create(updateDto.batchingDetail);
          await this.batchingDetailRepository.save(batchingDetail);
          cashDepositMethod.batchingDetail = batchingDetail;
        } else {
          // Update existing batching detail
          Object.assign(cashDepositMethod.batchingDetail, updateDto.batchingDetail);
          await this.batchingDetailRepository.save(cashDepositMethod.batchingDetail);
        }
      }
      
      const result = await this.cashDepositMethodRepository.save(cashDepositMethod);
      
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async removeCashDepositMethod(id: number): Promise<void> {
    const cashDepositMethod = await this.findOneCashDepositMethod(id);
    
    // Delete batching detail if it exists
    if (cashDepositMethod.batchingDetail) {
      await this.batchingDetailRepository.remove(cashDepositMethod.batchingDetail);
    }
    
    await this.cashDepositMethodRepository.remove(cashDepositMethod);
  }

  // ========== Non-Cash Method CRUD ==========
  
  async createNonCashMethod(createDto: CreateNonCashMethodDto): Promise<NonCashMethod> {
    const settlementMethod = await this.settlementMethodRepository.findOne({
      where: { id: createDto.settlementMethodId }
    });
    
    if (!settlementMethod) {
      throw new NotFoundException(`Settlement method with ID ${createDto.settlementMethodId} not found`);
    }
    
    const nonCashMethod = this.nonCashMethodRepository.create({
      settlementMethod,
    });
    
    return this.nonCashMethodRepository.save(nonCashMethod);
  }

  async findAllNonCashMethods(): Promise<NonCashMethod[]> {
    return this.nonCashMethodRepository.find({
      relations: entityRelations.nonCashMethod,
    });
  }

  async findOneNonCashMethod(id: number): Promise<NonCashMethod> {
    return this.findEntityOrFail<NonCashMethod>(
      'nonCashMethod',
      id,
      entityRelations.nonCashMethod
    );
  }

  async updateNonCashMethod(
    id: number,
    updateDto: UpdateNonCashMethodDto,
  ): Promise<NonCashMethod> {
    const nonCashMethod = await this.findOneNonCashMethod(id);
    
    if (updateDto.settlementMethodId) {
      const settlementMethod = await this.settlementMethodRepository.findOne({
        where: { id: updateDto.settlementMethodId }
      });
      
      if (!settlementMethod) {
        throw new NotFoundException(`Settlement method with ID ${updateDto.settlementMethodId} not found`);
      }
      
      nonCashMethod.settlementMethod = settlementMethod;
    }
    
    return this.nonCashMethodRepository.save(nonCashMethod);
  }

  async removeNonCashMethod(id: number): Promise<void> {
    const nonCashMethod = await this.findOneNonCashMethod(id);
    await this.nonCashMethodRepository.remove(nonCashMethod);
  }

  // ========== Send Money Method CRUD ==========
  
  async createSendMoneyMethod(createDto: CreateSendMoneyMethodDto): Promise<SendMoneyMethod> {
    const settlementMethod = await this.settlementMethodRepository.findOne({
      where: { id: createDto.settlementMethodId }
    });
    
    if (!settlementMethod) {
      throw new NotFoundException(`Settlement method with ID ${createDto.settlementMethodId} not found`);
    }
    
    const sendMoneyMethod = this.sendMoneyMethodRepository.create({
      settlementMethod,
    });
    
    return this.sendMoneyMethodRepository.save(sendMoneyMethod);
  }

  async findAllSendMoneyMethods(): Promise<SendMoneyMethod[]> {
    return this.sendMoneyMethodRepository.find({
      relations: entityRelations.sendMoneyMethod,
    });
  }

  async findOneSendMoneyMethod(id: number): Promise<SendMoneyMethod> {
    return this.findEntityOrFail<SendMoneyMethod>(
      'sendMoneyMethod',
      id,
      entityRelations.sendMoneyMethod
    );
  }

  async updateSendMoneyMethod(
    id: number,
    updateDto: UpdateSendMoneyMethodDto,
  ): Promise<SendMoneyMethod> {
    const sendMoneyMethod = await this.findOneSendMoneyMethod(id);
    
    if (updateDto.settlementMethodId) {
      const settlementMethod = await this.settlementMethodRepository.findOne({
        where: { id: updateDto.settlementMethodId }
      });
      
      if (!settlementMethod) {
        throw new NotFoundException(`Settlement method with ID ${updateDto.settlementMethodId} not found`);
      }
      
      sendMoneyMethod.settlementMethod = settlementMethod;
    }
    
    return this.sendMoneyMethodRepository.save(sendMoneyMethod);
  }

  async removeSendMoneyMethod(id: number): Promise<void> {
    const sendMoneyMethod = await this.findOneSendMoneyMethod(id);
    await this.sendMoneyMethodRepository.remove(sendMoneyMethod);
  }

  // ========== Send Goods Method CRUD ==========
  
  async createSendGoodsMethod(createDto: CreateSendGoodsMethodDto): Promise<SendGoodsMethod> {
    const settlementMethod = await this.settlementMethodRepository.findOne({
      where: { id: createDto.settlementMethodId }
    });
    
    if (!settlementMethod) {
      throw new NotFoundException(`Settlement method with ID ${createDto.settlementMethodId} not found`);
    }
    
    const sendGoodsMethod = this.sendGoodsMethodRepository.create({
      settlementMethod,
    });
    
    return this.sendGoodsMethodRepository.save(sendGoodsMethod);
  }

  async findAllSendGoodsMethods(): Promise<SendGoodsMethod[]> {
    return this.sendGoodsMethodRepository.find({
      relations: entityRelations.sendGoodsMethod,
    });
  }

  async findOneSendGoodsMethod(id: number): Promise<SendGoodsMethod> {
    return this.findEntityOrFail<SendGoodsMethod>(
      'sendGoodsMethod',
      id,
      entityRelations.sendGoodsMethod
    );
  }

  async updateSendGoodsMethod(
    id: number,
    updateDto: UpdateSendGoodsMethodDto,
  ): Promise<SendGoodsMethod> {
    const sendGoodsMethod = await this.findOneSendGoodsMethod(id);
    
    if (updateDto.settlementMethodId) {
      const settlementMethod = await this.settlementMethodRepository.findOne({
        where: { id: updateDto.settlementMethodId }
      });
      
      if (!settlementMethod) {
        throw new NotFoundException(`Settlement method with ID ${updateDto.settlementMethodId} not found`);
      }
      
      sendGoodsMethod.settlementMethod = settlementMethod;
    }
    
    return this.sendGoodsMethodRepository.save(sendGoodsMethod);
  }

  async removeSendGoodsMethod(id: number): Promise<void> {
    const sendGoodsMethod = await this.findOneSendGoodsMethod(id);
    await this.sendGoodsMethodRepository.remove(sendGoodsMethod);
  }

  // ========== Batching Detail CRUD ==========
  
  async createBatchingDetail(createDto: CreateBatchingDetailDto): Promise<BatchingDetail> {
    const batchingDetail = this.batchingDetailRepository.create(createDto);
    return this.batchingDetailRepository.save(batchingDetail);
  }

  async findAllBatchingDetails(): Promise<BatchingDetail[]> {
    return this.batchingDetailRepository.find({
      relations: entityRelations.batchingDetail,
    });
  }

  async findOneBatchingDetail(id: number): Promise<BatchingDetail> {
    return this.findEntityOrFail<BatchingDetail>(
      'batchingDetail',
      id,
      entityRelations.batchingDetail
    );
  }

  async updateBatchingDetail(
    id: number,
    updateDto: UpdateBatchingDetailDto,
  ): Promise<BatchingDetail> {
    const batchingDetail = await this.findOneBatchingDetail(id);
    Object.assign(batchingDetail, updateDto);
    return this.batchingDetailRepository.save(batchingDetail);
  }

  async removeBatchingDetail(id: number): Promise<void> {
    const batchingDetail = await this.findOneBatchingDetail(id);
    await this.batchingDetailRepository.remove(batchingDetail);
  }
}