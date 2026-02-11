import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { BranchesModule } from './modules/branches/branches.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AuthModule } from './modules/auth/auth.module'; // <--- AGREGAR ESTO

@Module({
  imports: [
    // 1. Configuración de variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Conexión a MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI || process.env.MONGO_LOCAL || ""),

    // 3. Tus Módulos de Funcionalidad
    UsersModule,
    BranchesModule,
    ProductsModule,
    InventoryModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}