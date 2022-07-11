import { DatabaseModule } from '@shared/db';
import { Test } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setTimeout } from 'timers/promises';
import { getNestApp } from './nest.app';
import { Connection } from 'typeorm';
import { AccountEntity } from '@shared/account';
import { ConfigService } from '@nestjs/config';
import { clientFactory, ServiceEvents } from '@shared/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TransactionsEntity } from '@shared/transactions';
import {getConnection} from 'typeorm'
import { ConfigModule } from '@shared/config';
import { TransactionModule } from '@transaction/transaction';

async function insertDataAccount(connection: Connection) {
  const accounts = [
    {
      id: '1c7b3d22-bfe7-4fcb-8c00-f77039da065b',
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: 'firstAccount',
      lastName: 'firstAccount',
      balance: 40000,
    },
    {
      id: '20863556-645c-4db4-a2be-cabcbe324f99',
      created_at: new Date(),
      updated_at: new Date(),
      first_name: 'secondaccount',
      last_name: 'secondaccount',
      balance: 10000,
    },
    {
      id: '3592e667-afee-4b2b-9e73-2e228ba047e8',
      created_at: new Date(),
      updated_at: new Date(),
      first_name: 'thirdaccount',
      last_name: 'thirdaccount',
      balance: 0,
    },
  ];
  connection
    .createQueryBuilder()
    .insert()
    .into(AccountEntity)
    .values(accounts)
    .execute();
}

jest.setTimeout(50000);

describe('[Metadata endpoints]', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let connection: Connection;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TransactionModule,DatabaseModule,ConfigModule],
    }).compile();

    app = await getNestApp(moduleRef);
    httpServer = app.getHttpServer();
    client = clientFactory(
      new ConfigService(),
      'RABBIT_TRANSACTION_SEND_QUEUE',
    );
    await client.connect();
    connection = await getConnection(); 
  });

  describe('[POST Transaction]', () => {
    it('emit event to the transaction microservice', async () => {
      const result = await lastValueFrom(
        client.emit(ServiceEvents.TRANSACTION_SEND, {
          from: '1c7b3d22-bfe7-4fcb-8c00-f77039da065b',
          to: '20863556-645c-4db4-a2be-cabcbe324f99',
          message: 'hellw',
          money: 2011,
        }),
      );
       expect(result).toBe(true);
    });
 

  afterEach(async () => {
    await connection
    .createQueryBuilder()
    .delete()
    .from(TransactionsEntity)
    .execute();
    
    await connection
      .createQueryBuilder()
      .delete()
      .from(AccountEntity)
      .execute();
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
})
});
