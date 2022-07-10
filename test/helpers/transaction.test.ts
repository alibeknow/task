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

async function insertDataAccount(connection: Connection) {
  const accounts = [
    {
      id: '1c7b3d22-bfe7-4fcb-8c00-f77039da065b',
      created_at: new Date(),
      updated_at: new Date(),
      first_name: 'firstAccount',
      last_name: 'firstAccount',
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
      imports: [DatabaseModule],
    }).compile();

    app = await getNestApp(moduleRef);
    httpServer = app.getHttpServer();
    connection = app.get(Connection);
    client = clientFactory(
      new ConfigService(),
      'RABBIT_TRANSACTION_SEND_QUEUE',
    );
    await client.connect();
  });

  describe('[GET account]', () => {
    it('should return 404 error if requested item doesn`t exist in our DB', async () => {
      const actualResult = await request(httpServer)
        .get('accounts/heasd')
        .set('Accept', 'application/json');

      expect(actualResult.statusCode).toBe(404);
      expect(actualResult.body).toMatchSnapshot();
    });

    it('should return 400 error if validation doesn`t pass', async () => {
      const actualResult = await request(httpServer)
        .get('blahblah')
        .set('Accept', 'application/json');

      expect(actualResult.statusCode).toBe(400);
      expect(actualResult.body).toMatchSnapshot();
    });

    it('should return correct result based on request params', async () => {
      await insertDataAccount(connection);

      const actualResult1 = await request(httpServer)
        .get('/account/1c7b3d22-bfe7-4fcb-8c00-f77039da065b')
        .set('Accept', 'application/json');

      const actualResult2 = await request(httpServer)
        .get('/account/20863556-645c-4db4-a2be-cabcbe324f99')
        .set('Accept', 'application/json');

      expect(actualResult1.statusCode).toBe(200);
      expect(actualResult1.body).toMatchSnapshot();
      expect(actualResult2.statusCode).toBe(200);
      expect(actualResult2.body).toMatchSnapshot();
    });
  });

  describe('[GET account]', () => {
    it('emit event to the transaction microservice', async () => {
      const result = await lastValueFrom(
        client.emit(ServiceEvents.TRANSACTION_SEND, {
          from: '1c7b3d22-bfe7-4fcb-8c00-f77039da065b',
          to: '20863556-645c-4db4-a2be-cabcbe324f99',
          message: 'hellw',
          money: 2011,
        }),
      );
      await setTimeout(15000);
      expect(result).toBe(true);
    });
  });

  afterEach(async () => {
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
});
