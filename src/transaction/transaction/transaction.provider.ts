import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '@shared/account';
import { TransactionService } from '../../shared/transactions/transaction.service';
import { TransactionDto } from './transaction.dtos';

@Injectable()
export class TransactionProvider {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly service: TransactionService,
  ) {}

  async checkAndCreate(eventData: TransactionDto): Promise<boolean> {
    const resulter = await this.accountRepository.findOneBy({
      id: eventData.from,
    });
    if (resulter && resulter.balance > eventData.money) {
      await this.service.create(eventData);
      return true;
    }
    return false;
  }
}
