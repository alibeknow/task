import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export async function bootstrapMicroservice(
  app: INestApplication,
  rabbitQueue: string,
): Promise<void> {
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_URL')],
      queue: configService.get<string>(rabbitQueue),
      queueOptions: {
        durable: false,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
}
