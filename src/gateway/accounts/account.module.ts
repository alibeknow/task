import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';
import { TransactionService, TransactionsEntity } from '@shared/transactions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity, AccountService } from '@shared/account';
import { AccController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, TransactionsEntity])],
  providers: [AccountService, TransactionService, AccountResolver],
  controllers: [AccController],
})
export class AccountModule {}
