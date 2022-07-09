import { NotFoundException } from '@nestjs/common';
import { TransactionStatus } from '../../models/transaction.model';
import { IAccountsStore, ITransaction } from '../../datasources/accounts.store.types';
import { Account } from '../../models/account.model';
import { AccountsService } from '../accounts.service';

describe('AccountsService', () => {
  class AccountStoreMock implements IAccountsStore {
    findAccountById = jest.fn();
    updateAccountsBalance = jest.fn();
    startTransaction = jest.fn();
  }

  let accountsService: AccountsService;
  let accountsStore: IAccountsStore;

  beforeEach(() => {
    accountsStore = new AccountStoreMock();
    accountsService = new AccountsService(accountsStore);
  });

  describe('findOneById(...)', () => {
    it('should call accountsStore.findAccountById by the id param', async () => {
      const accountId = 'test_account_id';
      await accountsService.findOneById(accountId);

      expect(accountsStore.findAccountById).toHaveBeenCalledTimes(1);
      expect(accountsStore.findAccountById).toHaveBeenCalledWith(accountId);
    });

    it('should return whatever accountsStore.findAccountById returns', async () => {
      const account: Account = {
        id: 'test_account_id',
        balance: 100,
      };
      jest.spyOn(accountsStore, 'findAccountById').mockResolvedValue(account);
      const resultAccount = await accountsService.findOneById(account.id);

      expect(resultAccount).toEqual(account);
    });
  });

  describe('balanceTransfer(...)', () => {
    const sender: Account = { id: 'sender_id', balance: 100 };
    const recipient: Account = { id: 'recipient_id', balance: 200 };
    const args = {
      senderId: sender.id,
      recipientId: recipient.id,
      amount: 10,
    };
    let transaction: ITransaction;

    beforeEach(() => {
      transaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      jest.spyOn(accountsStore, 'startTransaction').mockResolvedValue(transaction);
      jest.spyOn(accountsStore, 'updateAccountsBalance').mockResolvedValue([sender, recipient]);
    });

    it('should start a transaction', async () => {
      await accountsService.balanceTransfer(args);

      expect(accountsStore.startTransaction).toHaveBeenCalledTimes(1);
    });

    it('should call accountsStore.updateAccountsBalance with the correct operations and the transaction started', async () => {
      await accountsService.balanceTransfer(args);

      expect(accountsStore.updateAccountsBalance).toHaveBeenCalledTimes(1);
      expect(accountsStore.updateAccountsBalance).toHaveBeenCalledWith(
        [
          { accountId: sender.id, operator: '-', amount: args.amount },
          { accountId: recipient.id, operator: '+', amount: args.amount },
        ],
        transaction,
      );
    });

    it(`should throw if the sender account isn't found & rollback the transaction`, async () => {
      jest.spyOn(accountsStore, 'updateAccountsBalance').mockResolvedValue([recipient]);

      await expect(accountsService.balanceTransfer(args)).rejects.toBeInstanceOf(NotFoundException);
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
    });

    it(`should throw if the recipient account isn't found & rollback the transaction`, async () => {
      jest.spyOn(accountsStore, 'updateAccountsBalance').mockResolvedValue([sender]);

      await expect(accountsService.balanceTransfer(args)).rejects.toBeInstanceOf(NotFoundException);
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
    });

    it('should return a failed transaction in case the sender balance is not enough and rollback', async () => {
      jest.spyOn(accountsStore, 'updateAccountsBalance').mockResolvedValue([
        {
          ...sender,
          balance: -10,
        },
        recipient,
      ]);

      const result = await accountsService.balanceTransfer(args);

      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(result.transactionStatus).toEqual(TransactionStatus.FAILED);
    });

    it('should commit the transaction and return a successful transaction', async () => {
      const result = await accountsService.balanceTransfer(args);

      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(result.transactionStatus).toEqual(TransactionStatus.SUCCESSFUL);
    });
  });
});
