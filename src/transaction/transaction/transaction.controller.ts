import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ServiceEvents } from '@shared/microservices';
import { TransactionService } from '@shared/transactions';
import { TransactionDto } from './transaction.dtos';
import { logger } from '../../shared/logger/logger';
import { TransactionProvider } from './transaction.provider';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionProvider) {}

  @EventPattern(ServiceEvents.TRANSACTION_SEND)
  async eventHandler(
    @Ctx() context: RmqContext,
    @Payload() eventData: TransactionDto,
  ) {
    logger.info(eventData, 'recieve the message');
    try {
      const data = await this.transactionService.checkAndCreate(eventData);
      const channel = context.getChannelRef();
      channel.ack(context.getMessage());
      return data;
    } catch (error) {
      return error;
    }
  }
}
