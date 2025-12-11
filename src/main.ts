import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3001;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}
bootstrap();
