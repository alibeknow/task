import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AccountService } from '../../shared/account/account.service';
import { MESSAGE_BUS_PROVIDER } from '../../shared/microservices/constants';
import { ServiceEvents } from '../../shared/microservices/services.types';
import { TransactionDto } from '../../transaction/transaction/transaction.dtos';
import { logger } from '../../shared/logger/logger';

@Controller()
export class AccController {
  constructor(
    private readonly accountService: AccountService,
    @Inject(MESSAGE_BUS_PROVIDER) private messageBusClient: ClientProxy,
  ) {}

  @Get()
  getAccounts() {
    return this.accountService.findAll();
  }
  @Post()
  async sendMoney(metadataEvent: TransactionDto) {
    metadataEvent = {
      from: 'd5eff206-c154-4617-8fa2-8c6247b6bc5d',
      to: '496a9556-f716-4c65-b940-7778faf8e246',
      message: 'hellw',
      money: 2011,
    };
    try {
      await lastValueFrom(
        this.messageBusClient.emit(
          ServiceEvents.TRANSACTION_SEND,
          metadataEvent,
        ),
      );
    } catch (error) {
      logger.error(error, 'error when sending message');
    }
  }
}
