import { ConfigModule } from '@shared/config';
import { DatabaseModule } from '@shared/db';
import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction';

@Module({
  imports: [ConfigModule, TransactionModule, DatabaseModule],
})
export class AppModule {}
