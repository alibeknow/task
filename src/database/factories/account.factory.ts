import { define } from 'typeorm-seeding';
import { AccountEntity } from '../../shared/account/account.entity';

define(AccountEntity, (faker: any) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);

  const account = new AccountEntity();
  account.firstName = firstName;
  account.lastName = lastName;
  account.balance = 40000;

  return account;
});
