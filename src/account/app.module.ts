import { DatabaseModule } from '@shared/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
    DatabaseModule,
  ],
})
export class AppModule {}
