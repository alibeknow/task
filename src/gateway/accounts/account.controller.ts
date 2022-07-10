import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
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
  async sendMoney(@Body() metadataEvent: TransactionDto) {
    console.log(metadataEvent)
    try {
      return await lastValueFrom(
        this.messageBusClient.emit(
          ServiceEvents.TRANSACTION_SEND,
          metadataEvent,
        ),
      );
    } catch (error) {
      logger.error(error, 'error when sending message');
      return error;
    }
  }
}
