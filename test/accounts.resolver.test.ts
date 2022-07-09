import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionStatus } from '../../models/transaction.model';
import { Account } from '../../models/account.model';
import { AccountsResolver } from '../accounts.resolver';
import { AccountsService } from '../accounts.service';

describe('AccountsResolver', () => {
  class AccountServiceMock extends AccountsService {
    constructor() {
      super(undefined);
    }
    findOneById = jest.fn();
  }

  let accountsResolver: AccountsResolver;
  let accountsService: AccountsService;

  beforeEach(() => {
    accountsService = new AccountServiceMock();
    accountsResolver = new AccountsResolver(accountsService);
  });

  describe('account(...)', () => {
    it('should throw bad request exception if id is missing', async () => {
      expect(accountsResolver.account(undefined)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw not found exception if account is not found', async () => {
      jest.spyOn(accountsService, 'findOneById').mockResolvedValue(undefined);

      expect(accountsResolver.account('some_account_id')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return the account returned by accountsService.findOneById', async () => {
      const account: Account = {
        id: 'some_account_id',
        balance: 100,
      };

      jest.spyOn(accountsService, 'findOneById').mockResolvedValue(account);

      expect(await accountsResolver.account(account.id)).toEqual(account);
    });
  });

  describe('balanceTransfer(...)', () => {
    beforeEach(() => {
      jest.spyOn(accountsService, 'balanceTransfer').mockResolvedValue({} as any);
    });

    it('should throw bad request if the senderAccountId is missing', async () => {
      expect(accountsResolver.balanceTransfer(undefined, 'recipient_id', 10)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw bad request if the recipientAccountId is missing', async () => {
      expect(accountsResolver.balanceTransfer('sender_id', undefined, 10)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw bad request if the amount is missing', async () => {
      expect(accountsResolver.balanceTransfer('sender_id', 'recipient_id', undefined)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw bad request if the amount is 0', async () => {
      expect(accountsResolver.balanceTransfer('sender_id', 'recipient_id', 0)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should call accountsService.balanceTransfer with the sent params', async () => {
      const args = {
        senderId: 'sender_id',
        recipientId: 'recipient_id',
        amount: 20,
      };
      await accountsResolver.balanceTransfer(args.senderId, args.recipientId, args.amount);

      expect(accountsService.balanceTransfer).toHaveBeenCalledWith(args);
    });

    it('should send the response from the result of the balances transfer transaction', async () => {
      const expectedResult = {
        transactionStatus: TransactionStatus.SUCCESSFUL,
        message: 'some_error_message',
        senderCurrentBalance: 100,
      };

      jest.spyOn(accountsService, 'balanceTransfer').mockResolvedValue({
        transactionStatus: expectedResult.transactionStatus,
        message: expectedResult.message,
        senderAccount: {
          id: 'sender_uuid',
          balance: 100,
        },
      });

      const result = await accountsResolver.balanceTransfer('sender_uuid', 'recipient_uuid', 10);

      expect(result).toEqual(expectedResult);
    });
  });
});
