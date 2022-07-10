import { TransactionStatus, TransactionsEntity } from './transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, Transaction } from 'typeorm';
import { TransactionDto } from '@transaction/transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionRepository: Repository<TransactionsEntity>,
  ) {}

  async create(eventData: TransactionDto): Promise<TransactionsEntity | void> {
    const transactionInstance = this.transactionRepository.create({
        to: eventData.to,
        from: eventData.from,
        money: eventData.money,
        message: eventData.message,
        transactionStatus: TransactionStatus.SUCCESSFUL,
      });
      const transactionResult= this.transactionRepository.save(transactionInstance);
      return transactionResult
    
  }

  get(id: string): Promise<TransactionsEntity | undefined | null> {
    return this.transactionRepository.findOne({ where: { id } });
  }
  getAllTo(owner: string) {
    return this.transactionRepository.find({ where: { to: owner } });
  }
  getAllFrom(owner: string) {
    return this.transactionRepository.find({ where: { from: owner } });
  }
}
