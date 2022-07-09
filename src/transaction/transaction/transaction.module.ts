import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule as CustomConfigModule } from '@shared/config';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '@shared/transactions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from '../../shared/transactions/transaction.entity';
import {
  MESSAGE_BUS_PROVIDER,
  clientFactory,
  RABBIT_TRANSACTION_SEND_QUEUE,
} from '@shared/microservices';
import { AccountModule } from '@gateway/accounts/account.module';
import { TransactionProvider } from './transaction.provider';
import { AccountEntity } from '../../shared/account/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsEntity, AccountEntity]),
    CustomConfigModule,
    forwardRef(() => AccountModule),
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: RABBIT_TRANSACTION_SEND_QUEUE,
      useFactory: (configService: ConfigService) =>
        configService.get<string>(RABBIT_TRANSACTION_SEND_QUEUE),
      inject: [ConfigService],
    },
    {
      provide: MESSAGE_BUS_PROVIDER,
      useFactory: clientFactory,
      inject: [ConfigService, RABBIT_TRANSACTION_SEND_QUEUE],
    },
    TransactionService,
    TransactionProvider,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
