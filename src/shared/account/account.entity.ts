import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

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
}
