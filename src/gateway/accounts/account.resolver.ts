import { Inject } from '@nestjs/common';
import { Args, Parent, ResolveField, Resolver, Query } from '@nestjs/graphql';
import { AccountService } from '@shared/account';
import { AccountEntity } from '@shared/account';
import { TransactionService, TransactionsEntity } from '@shared/transactions';
import { MESSAGE_BUS_PROVIDER, ServiceEvents } from '@shared/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { logger } from '../../shared/logger/logger';
import { TransactionDto } from '../../transaction/transaction/transaction.dtos';

@Resolver(() => AccountEntity)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    @Inject(MESSAGE_BUS_PROVIDER) private messageBusClient: ClientProxy,
  ) {}

  @Query((returns) => AccountEntity)
  async getAccount(@Args('id') id: string) {
    const account = await this.accountService.findOne(id);
    if (account) return account;
  }

  @ResolveField('transactions', () => [TransactionsEntity])
  async getTransactions(@Parent() author: AccountEntity) {
    const { id } = author;
    return this.transactionService.getAllFrom(id);
  }

  async sendMoney(metadataEvent: TransactionDto) {
    try {
      await lastValueFrom(
        this.messageBusClient.emit(
          ServiceEvents.TRANSACTION_SEND,
          metadataEvent,
        ),
      );
    } catch (error) {
      logger.error(error, 'error when sending message');
    }
  }
}
