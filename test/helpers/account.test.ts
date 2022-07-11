import { DatabaseModule } from '@shared/db';
import { Test } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getNestApp } from './nest.app';
import { Connection, getConnection } from 'typeorm';
import { AccountEntity } from '../../src/shared/account/account.entity';
import { AppGatewayModule } from '../../src/gateway/app.module';
import { ConfigModule } from '@nestjs/config';

async function insertDataAccount(connection: Connection) {
  const accounts = [
    {
      id: '1c7b3d22-bfe7-4fcb-8c00-f77039da065b',
      createdAt: '2022-07-11T05:22:49.029Z',
      updatedAt: '2022-07-11T05:22:49.029Z',
      firstName: 'firstAccount',
      lastName: 'firstAccount',
      balance: 40000,
    },
    {
      id: '20863556-645c-4db4-a2be-cabcbe324f99',
      createdAt: '2022-07-11T05:22:49.029Z',
      updatedAt: '2022-07-11T05:22:49.029Z',
      firstName: 'secondaccount',
      lastName: 'secondaccount',
      balance: 10000,
    },
    {
      id: '3592e667-afee-4b2b-9e73-2e228ba047e8',
      createdAt: '2022-07-11T05:22:49.029Z',
      updatedAt: '2022-07-11T05:22:49.029Z',
      firstName: 'thirdaccount',
      lastName: 'thirdaccount',
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

describe('[Metadata endpoints]', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppGatewayModule,ConfigModule,DatabaseModule],
    }).compile();

    app = await getNestApp(moduleRef);
    httpServer = app.getHttpServer();
    connection = await getConnection(); 
  });

  describe('[GET account]', () => {
    it('should return 404 error if requested item doesn`t exist in our DB', async () => {
      const actualResult = await request(httpServer)
        .get('/blahblah')
        .set('Accept', 'application/json');
      console.log(actualResult)
      expect(actualResult.statusCode).toBe(404);
      expect(actualResult.body).toMatchSnapshot();
    });

    it('should return 400 error if validation doesn`t pass', async () => {
      const actualResult = await request(httpServer)
      .get('/account/heasd')
        .set('Accept', 'application/json');

      expect(actualResult.statusCode).toBe(400);
      expect(actualResult.body).toMatchSnapshot();
    });

    it('should return correct result based on request params', async () => {
      await insertDataAccount(connection);

      const actualResult1 = await request(httpServer)
        .get('/account/1c7b3d22-bfe7-4fcb-8c00-f77039da065b')
        .set('Accept', 'application/json'); 
        console.log(actualResult1)

      const actualResult2 = await request(httpServer)
        .get('/account/20863556-645c-4db4-a2be-cabcbe324f99')
        .set('Accept', 'application/json');
      
      expect(actualResult1.statusCode).toBe(200);
      expect(actualResult1.body).toMatchSnapshot();
      expect(actualResult2.statusCode).toBe(200);
      expect(actualResult2.body).toMatchSnapshot();
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
