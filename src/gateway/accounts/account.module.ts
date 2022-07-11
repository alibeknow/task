import {
  clientFactory,
  MESSAGE_BUS_PROVIDER,
  RABBIT_TRANSACTION_SEND_QUEUE,
} from '@shared/microservices';
import { Module } from '@nestjs/common';
import { AccountResolver } from './account.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity, AccountService } from '@shared/account';
import { AccController } from './account.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [
    AccountService,
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
  ],
  controllers: [AccController],
  exports: [AccountService],
})
export class AccountModule {}
