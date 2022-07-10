import { Entity, Column, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from '../abstract.entity';
import { TransactionsEntity } from '../transactions';

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
