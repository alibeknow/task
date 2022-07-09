import { Args, Parent, ResolveField, Resolver, Query } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { AccountSchema } from '@shared/account';
import { TransactionSchema } from '@shared/transactions';
import { TransactionService } from '@transaction/transaction';

@Resolver(() => AccountSchema)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}

  @Query((returns) => AccountSchema)
  async getAccount(@Args('id') id: string) {
    const account = await this.accountService.findOne(id);
    if (account) return account;
  }

  @ResolveField('transactions', () => [TransactionSchema])
  async getTransactions(@Parent() author: AccountSchema) {
    const { id } = author;
    return this.transactionService.getAllFrom(id);
  }
}
