import { dbClient } from '../../common/utils/dbClient';
import { AccountsStore } from '../accounts.store';
import { DBAccount } from '../accounts.store.types';

// TODO: Better mocking for knex, check out https://npmjs.com/package/mock-knex
jest.mock('../../common/utils/dbClient', () => ({
  dbClient: {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    table: jest.fn().mockReturnThis(),
    transaction: jest.fn().mockReturnThis(),
    commit: jest.fn().mockReturnThis(),
    rollback: jest.fn().mockReturnThis(),
    raw: jest.fn().mockReturnThis(),
    then: jest.fn((done) => done([])),
  },
}));

describe('AccountsStore', () => {
  let accountStore: AccountsStore;

  beforeEach(() => {
    accountStore = new AccountsStore();
  });

  afterAll(() => jest.resetAllMocks());

  describe('findAccountById(...)', () => {
    beforeEach(() => {
      jest.spyOn(dbClient, 'where').mockResolvedValue([]);
    });

    it('should return undefined if the db results are empty', async () => {
      const result = await accountStore.findAccountById('some_id');

      expect(result).toBeUndefined();
    });

    it('should map the db result in case of a hit', async () => {
      const dbAccount: DBAccount = {
        account_id: 'some_acc_id',
        balance: 110,
        updated_at: new Date().toISOString(),
      };

      jest.spyOn(dbClient, 'where').mockResolvedValue([dbAccount]);

      const result = await accountStore.findAccountById('some_id');

      expect(result.id).toEqual(dbAccount.account_id);
      expect(result.balance).toEqual(dbAccount.balance);
    });
  });
});
