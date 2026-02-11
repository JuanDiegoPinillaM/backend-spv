import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { InventoryController } from './controller/inventory.controller';
import { InventoryService } from './services/inventory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService], // Exportamos porque Ventas necesitará restar stock
})
export class InventoryModule {}