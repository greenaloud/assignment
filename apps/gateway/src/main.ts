import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { RpcToHttpExceptionFilter } from '@app/common/filters/rpc-to-http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());
  app.use(cookieParser());
  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new RpcToHttpExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
