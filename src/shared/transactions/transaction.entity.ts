import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { AccountEntity } from '../account/account.entity';

export enum TransactionStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

@Entity()
@ObjectType({ description: 'transaction' })
export class TransactionsEntity extends AbstractEntity {
  @Column()
  @Field()
  from!: string;

  @Column()
  @Field()
  to!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  @Field()
  money!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  message!: string;

  @ManyToOne((type) => AccountEntity, (account) => account.transactions)
  @Field((type) => [AccountEntity], { nullable: 'items' })
  account!: AccountEntity;

  @Field(() => TransactionStatus)
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  transactionStatus!: TransactionStatus;
}
registerEnumType(TransactionStatus, { name: 'TransactionStatus' });
