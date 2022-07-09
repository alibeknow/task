import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';
import { TransactionService, TransactionsEntity } from '@shared/transactions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity, AccountService } from '@shared/account';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, TransactionsEntity])],
  providers: [AccountService, TransactionService, AccountResolver],
})
export class AccountModule {}
