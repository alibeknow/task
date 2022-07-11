import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AccountService, AccountEntity } from '@shared/account';
import { MESSAGE_BUS_PROVIDER, ServiceEvents } from '@shared/microservices';
import { TransactionDto } from '@transaction/transaction';
import { logger } from '@shared/logger';
import { AccountDto } from './dto/account.dto';

@Controller()
export class AccController {
  constructor(
    private readonly accountService: AccountService,
    @Inject(MESSAGE_BUS_PROVIDER) private messageBusClient: ClientProxy,
  ) {}

  @Post('createAccount')
  async createAccount(@Body() accountDto: AccountDto): Promise<AccountEntity> {
    return this.accountService.create(accountDto);
  }

  @Get('account/:id')
  getAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountService.findOne(id);
  }

  @Get('accounts')
  getAccounts() {
    return this.accountService.findAll();
  }
  @Post('sendmoney')
  async sendMoney(@Body() metadataEvent: TransactionDto) {
    console.log(metadataEvent);
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
