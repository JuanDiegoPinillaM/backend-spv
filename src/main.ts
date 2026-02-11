import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setServers } from 'node:dns';

async function bootstrap() {
  setServers(['8.8.8.8', '1.1.1.1']); 

  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();