import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ServiceEvents } from '@shared/microservices';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './transaction.dtos';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern(ServiceEvents.TRANSACTION_SEND)
  async eventHandler(
    @Ctx() context: RmqContext,
    @Payload() eventData: TransactionDto,
  ) {
    await this.transactionService.create(eventData);
    const channel = context.getChannelRef();
    channel.ack(context.getMessage());
  }
}
