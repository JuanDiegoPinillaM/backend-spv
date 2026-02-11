import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Módulos existentes
import { UsersModule } from './modules/users/users.module';
import { BranchesModule } from './modules/branches/branches.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AuthModule } from './modules/auth/auth.module';

// 👇 1. IMPORTAR EL MÓDULO DE VENTAS
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    
    UsersModule,
    BranchesModule,
    ProductsModule,
    InventoryModule,
    AuthModule,
    
    // 👇 2. REGISTRARLO AQUÍ
    SalesModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}