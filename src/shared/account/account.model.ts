import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TransactionSchema } from '@shared/transactions';

@ObjectType({ description: 'account' })
export class AccountSchema {
  @Field(() => ID)
  id!: string;

  @Field()
  balance!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field((type) => [TransactionSchema])
  transactions!: TransactionSchema[];
}
