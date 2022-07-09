import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@shared/abstract.entity';
import { TransactionsEntity } from '@shared/transactions';

@Entity()
export class AccountEntity extends AbstractEntity {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'decimal' })
  balance!: number;

  @OneToMany((type) => TransactionsEntity, (transaction) => transaction.account) // note: we will create author property in the Photo class below
  transactions!: TransactionsEntity[];
}
