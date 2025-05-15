import { NestFactory } from '@nestjs/core';
import { EventsModule } from './events.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
