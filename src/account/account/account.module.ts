import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule as CustomConfigModule } from '@shared/config';
import { DatabaseModule } from '@shared/db';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {
  MESSAGE_BUS_PROVIDER,
  clientFactory,
  RABBIT_TRANSACTION_SEND_QUEUE,
} from '@shared/microservices';

@Module({
  imports: [DatabaseModule, CustomConfigModule],
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
})
export class AccountModule {}
