// src/modules/inventory/schemas/inventory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Branch } from '../../branches/schemas/branch.schema';
import { Product } from '../../products/schemas/product.schema';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Branch | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Product | Types.ObjectId;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true, default: 5 })
  minStock: number; // Para alertas de stock bajo
}

const InventorySchema = SchemaFactory.createForClass(Inventory);

// INDICE COMPUESTO: Crucial para evitar duplicados.
// No puedes tener el mismo producto dos veces en la misma sede.
InventorySchema.index({ branch: 1, product: 1 }, { unique: true });

export { InventorySchema };