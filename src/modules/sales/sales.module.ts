import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './controller/sales.controller';
import { SalesService } from './services/sales.service';

// Importamos los Schemas que vamos a usar
import { Sale, SaleSchema } from './schemas/sale.schema';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      // Registramos estos modelos AQUÍ para poder inyectarlos en SalesService
      { name: Inventory.name, schema: InventorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}