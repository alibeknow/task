import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { AccountEntity } from '@shared/account';
import { TransactionService } from '../../shared/transactions/transaction.service';
import { TransactionDto } from './transaction.dtos';
import { logger } from '../../shared/logger/logger';


@Injectable()
export class TransactionProvider {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly service: TransactionService,
  ) {}


  async checkAndCreate(eventData: TransactionDto): Promise<boolean> {
    console.log('HELLOOOOOOOOOO',eventData)
    const sender = await this.accountRepository.findOne({
      id: eventData.from,
    });
    const recipient = await this.accountRepository.findOne({
      id: eventData.to,
    });
    if (sender && sender.balance > eventData.money && recipient) {
      try {
        await getManager().transaction(async transactionalEntityManager => {
          recipient.balance+=eventData.money
          sender.balance-=eventData.money
          await transactionalEntityManager.save(recipient);
          await transactionalEntityManager.save(sender);
          await this.service.create(eventData);
          // ...
      });        
      return true
      } catch (error) {
        console.log(error)
        return false
      }

    }
    return false;
  }
}
