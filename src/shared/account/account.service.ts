import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '@shared/account';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  findAll(): Promise<AccountEntity[]> {
    return this.accountRepository.find();
  }

  findOne(id: string): Promise<AccountEntity | null> {
    return this.accountRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }
}