import type { Factory, Seeder } from 'typeorm-seeding';
import { AccountEntity } from '../../shared/account/account.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(AccountEntity)({ roles: [] }).createMany(6);
  }
}
