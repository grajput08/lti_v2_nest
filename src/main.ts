import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Needed for LTI form_post requests
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.enableCors({
    origin: 'http://localhost:3000', // frontend allowed
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const logger = new Logger('Bootstrap');

  // 👇 Do NOT listen to a port when using ltijs
  await app.init();

  logger.log('NestJS initialized. LTI provider will manage the server.');
}

bootstrap();
