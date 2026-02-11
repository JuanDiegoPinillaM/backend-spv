import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

// 1. IMPORTAR EL CONTROLADOR Y EL SERVICIO (Ajustando la ruta a tus carpetas)
import { UsersController } from './controller/users.controller';
import { UsersService } from './services/users.services'; // Ojo: verifica si tu archivo termina en 's' o no

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  // 2. REGISTRARLOS AQUÍ:
  controllers: [UsersController], 
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}