import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConfigService } from './api-config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [NestConfigModule.forRoot()],
  providers: [ApiConfigService, ConfigService],
  exports: [ApiConfigService, ConfigService],
})
export class ConfigModule {}
