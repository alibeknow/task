import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  RABBIT_ACCOUNT_GET_QUEUE,
  bootstrapMicroservice,
} from '@shared/microservices';
import { AppModule } from './app.module';
import { logger } from '@shared/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableShutdownHooks();
  await bootstrapMicroservice(app, RABBIT_ACCOUNT_GET_QUEUE);

  await app.listen(8080);
  logger.info('Server is running on http://localhost:8080, 🚀`');
}

bootstrap();
