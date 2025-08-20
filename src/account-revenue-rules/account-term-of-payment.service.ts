import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountTermOfPayment } from './entities/account-term-of-payment.entity';
import { CreateAccountTermOfPaymentDto, UpdateAccountTermOfPaymentDto } from './dto/account-term-of-payment.dto';

@Injectable()
export class AccountTermOfPaymentService {
  constructor(
    @InjectRepository(AccountTermOfPayment)
    private accountTermOfPaymentRepository: Repository<AccountTermOfPayment>,
  ) {}

  async create(createDto: CreateAccountTermOfPaymentDto, username: string): Promise<AccountTermOfPayment> {
    const termOfPayment = this.accountTermOfPaymentRepository.create({
      ...createDto,
      created_by: username,
    });

    return await this.accountTermOfPaymentRepository.save(termOfPayment);
  }

  async findByAccountId(accountId: string): Promise<AccountTermOfPayment[]> {
    return await this.accountTermOfPaymentRepository.find({
      where: { 
        account_id: accountId,
        is_active: true 
      },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AccountTermOfPayment> {
    const termOfPayment = await this.accountTermOfPaymentRepository.findOne({
      where: { id, is_active: true },
    });

    if (!termOfPayment) {
      throw new NotFoundException('Term of payment not found');
    }

    return termOfPayment;
  }

  async update(id: string, updateDto: UpdateAccountTermOfPaymentDto, username: string): Promise<AccountTermOfPayment> {
    const termOfPayment = await this.findOne(id);

    Object.assign(termOfPayment, {
      ...updateDto,
      updated_by: username,
    });

    return await this.accountTermOfPaymentRepository.save(termOfPayment);
  }

  async remove(id: string): Promise<void> {
    const termOfPayment = await this.findOne(id);
    termOfPayment.is_active = false;
    await this.accountTermOfPaymentRepository.save(termOfPayment);
  }

  async removeByAccountId(accountId: string): Promise<void> {
    await this.accountTermOfPaymentRepository.update(
      { account_id: accountId, is_active: true },
      { is_active: false }
    );
  }

  async createOrUpdate(accountId: string, termData: Omit<CreateAccountTermOfPaymentDto, 'account_id'>, username: string): Promise<AccountTermOfPayment> {
    // Find existing term of payment for this account
    const existing = await this.accountTermOfPaymentRepository.findOne({
      where: { account_id: accountId, is_active: true }
    });

    if (existing) {
      // Update existing
      Object.assign(existing, {
        ...termData,
        updated_by: username,
      });
      return await this.accountTermOfPaymentRepository.save(existing);
    } else {
      // Create new
      return await this.create({ ...termData, account_id: accountId }, username);
    }
  }
}
