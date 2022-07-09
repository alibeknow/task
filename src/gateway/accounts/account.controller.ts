import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../../shared/account/account.service';

@Controller()
export class AccController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAccounts() {
    return this.accountService.findAll();
  }
}
