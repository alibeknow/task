import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import { ResponseInterceptor } from './response';

export const configureAppMiddleware = (app: NestExpressApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  app.use(helmet());
  app.use(compression());
  app.useGlobalInterceptors(new ResponseInterceptor());
};
