import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule as CustomConfigModule } from '@shared/config';
import { AccountController } from './account.controller';
import { AccountService } from '@shared/account';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../../shared/account/account.entity';
import {
  MESSAGE_BUS_PROVIDER,
  clientFactory,
  RABBIT_TRANSACTION_SEND_QUEUE,
} from '@shared/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), CustomConfigModule],
  controllers: [AccountController],
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
    AccountService,
  ],
  exports: [AccountService],
})
export class AccountModule {}
