import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ServiceEvents } from '@shared/microservices';
import { AccountService } from '@shared/account';
import { AccountDto } from './account.dtos';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @EventPattern(ServiceEvents.GET_ACCOUNT)
  async eventHandler(
    @Ctx() context: RmqContext,
    @Payload() eventData: AccountDto,
  ) {
    await this.accountService.findOne(eventData.accountId);
    const channel = context.getChannelRef();
    channel.ack(context.getMessage());
  }
}
