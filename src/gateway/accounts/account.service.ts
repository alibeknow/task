import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '@shared/account';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private usersRepository: Repository<AccountEntity>,
  ) {}

  findAll(): Promise<AccountEntity[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<AccountEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
