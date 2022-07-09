import { Args, Parent, ResolveField, Resolver, Query } from '@nestjs/graphql';
import { AccountService } from '@shared/account';
import { AccountEntity } from '@shared/account';
import { TransactionService, TransactionsEntity } from '@shared/transactions';

@Resolver(() => AccountEntity)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
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
}
