import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@shared/abstract.entity';
import { TransactionsEntity } from '@shared/transactions';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType({ description: 'account' })
export class AccountEntity extends AbstractEntity {
  @Column()
  @Field()
  firstName!: string;

  @Column()
  @Field()
  lastName!: string;

  @Column({ type: 'int' })
  @Field()
  balance!: number;

  @OneToMany((type) => TransactionsEntity, (transaction) => transaction.account)
  @Field((type) => [TransactionsEntity], { nullable: 'items' })
  transactions!: TransactionsEntity[];
}
