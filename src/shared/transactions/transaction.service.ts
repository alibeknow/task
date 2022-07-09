import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsEntity } from '@shared/transactions';
import { Repository } from 'typeorm';
import { TransactionDto } from '@transaction/transaction';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private transactionRepository: Repository<TransactionsEntity>,
  ) {}

  create(eventData: TransactionDto): Promise<TransactionsEntity> {
    const transactionInstance = this.transactionRepository.create({
      to: eventData.to,
      from: eventData.from,
      money: eventData.money,
      message: eventData.message,
    });
    return this.transactionRepository.save(transactionInstance);
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
