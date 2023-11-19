import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function boot() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(7700);
}
boot();
