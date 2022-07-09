import { TransactionStatus } from './transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsEntity } from '@shared/transactions';
import { Repository } from 'typeorm';
import { TransactionDto } from '@transaction/transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionRepository: Repository<TransactionsEntity>,
  ) {}

  async create(eventData: TransactionDto): Promise<TransactionsEntity | void> {
    const result = true;
    if (result) {
      const transactionInstance = this.transactionRepository.create({
        to: eventData.to,
        from: eventData.from,
        money: eventData.money,
        message: eventData.message,
        transactionStatus: TransactionStatus.SUCCESSFUL,
      });
      return this.transactionRepository.save(transactionInstance);
    }
    return;
  }

  get(id: string): Promise<TransactionsEntity | null> {
    return this.transactionRepository.findOne({ where: { id } });
  }
  getAllTo(owner: string) {
    return this.transactionRepository.find({ where: { to: owner } });
  }
  getAllFrom(owner: string) {
    return this.transactionRepository.find({ where: { from: owner } });
  }
}
