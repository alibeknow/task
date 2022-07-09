import { Field, ObjectType, registerEnumType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'transaction' })
class Transaction {
  @Field(() => TransactionStatus)
  transactionStatus!: TransactionStatus;
}

@ObjectType({ description: 'balanceTransferTransaction' })
export class TransactionSchema extends Transaction {
  @Field((type) => Int, { nullable: true })
  senderCurrentBalance?: number;

  @Field({ nullable: true })
  message?: string;
}

export enum TransactionStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}
registerEnumType(TransactionStatus, { name: 'TransactionStatus' });
