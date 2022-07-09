import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const clientFactory = (
  configService: ConfigService,
  rmqQueueName: string,
) => {
  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_URL') as string],
      queue: rmqQueueName,
      queueOptions: {
        durable: false,
      },
    },
  });
};
