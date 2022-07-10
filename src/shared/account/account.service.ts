import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './account.entity';

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

  async checkBalance(from: string, money: number): Promise<boolean> {
    const resulter = await this.accountRepository.findOne({ id: from });
    if (resulter && resulter.balance > money) return true;
    return false;
  }
}
