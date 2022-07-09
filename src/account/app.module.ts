import { DatabaseModule } from '@shared/db';
import { Module } from '@nestjs/common';
import { MicroserviceAccountModule } from './account';
import { ConfigModule } from '@shared/config';

@Module({
  imports: [ConfigModule, MicroserviceAccountModule, DatabaseModule],
})
export class AppModule {}
