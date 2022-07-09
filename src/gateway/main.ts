import { NestFactory } from '@nestjs/core';
import { AppGatewayModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppGatewayModule);
  await app.listen(3000);
}
bootstrap();
