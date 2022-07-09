import { Entity, Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { AccountEntity } from '../account/account.entity';

@Entity()
export class TransactionsEntity extends AbstractEntity {
  @Column()
  from!: string;

  @Column()
  to!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  money!: string;

  @Column()
  message!: string;

  @ManyToOne((type) => AccountEntity, (account) => account.transactions)
  account!: AccountEntity;
}
