import { DatabaseModule } from '@shared/db';
import { Module } from '@nestjs/common';
import { AccountModule } from './account';
import { ConfigModule } from '@shared/config';

@Module({
  imports: [ConfigModule, AccountModule, DatabaseModule],
})
export class AppModule {}
