import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './account.entity';
import { AccountDto } from '../../gateway/accounts/dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  findAll(): Promise<AccountEntity[]> {
    return this.accountRepository.find();
  }

  findOne(id: string): Promise<AccountEntity | undefined> {
    return this.accountRepository.findOne({ id });
  }
  create(account: AccountDto): Promise<AccountEntity> {
    const accountEntity = this.accountRepository.create(account);
    return this.accountRepository.save(accountEntity);
  }

  async checkBalance(from: string, money: number): Promise<boolean> {
    const resulter = await this.accountRepository.findOne({ id: from });
    if (resulter && resulter.balance > money) return true;
    return false;
  }
}
