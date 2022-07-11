import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccountModule } from './accounts/account.module';
import { DatabaseModule } from '../shared/db/db.module';

@Module({
  imports: [DatabaseModule, ConfigModule, AccountModule],
})
export class AppGatewayModule {}
