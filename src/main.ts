import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setServers } from 'node:dns';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Mantenemos tu configuración de DNS
  setServers(['8.8.8.8', '1.1.1.1']); 

  const app = await NestFactory.create(AppModule);
  
  // 1. Habilitar CORS (Vital para que Angular se conecte después)
  app.enableCors();

  // 2. Prefijo Global (Tus rutas ahora serán /api/users, /api/sales, etc.)
  app.setGlobalPrefix('api');

  // 3. Validaciones Globales (Activa los DTOs en todo el sistema)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina datos basura que envíe el frontend
      forbidNonWhitelisted: true, // Lanza error si envían campos extra
      transform: true, // Convierte tipos automáticamente (ej: string a number en params)
    }),
  );

  // 4. Configuración de Documentación (Swagger)
  const config = new DocumentBuilder()
    .setTitle('Sistema POS Ventas API')
    .setDescription('Documentación de la API para el sistema de punto de venta')
    .setVersion('1.0')
    .addBearerAuth() // Habilita el botón "Authorize" para probar con Token
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // La doc estará en /docs

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 API is running on: http://localhost:${port}/api`);
  console.log(`📑 Docs are running on: http://localhost:${port}/docs`);
}
bootstrap();