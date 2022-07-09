import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../../shared/account/account.entity';
import { Repository } from 'typeorm';
import { AccountDto } from './account.dtos';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) {}

  getAccount(eventData: AccountDto): Promise<AccountEntity | null> {
    return this.accountRepository.findOne({
      where: {
        id: eventData.accountId,
      },
    });
  }
}
