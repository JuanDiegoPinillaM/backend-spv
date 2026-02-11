import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose'; // <--- Importa esto
import { Branch } from '../../branches/schemas/branch.schema';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

export type SaleDocument = Sale & Document;

@Schema()
export class SaleItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Product | Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number; // Precio al momento de la venta (histórico)
  
  @Prop({ required: true })
  subtotal: number;
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true })
  branch: Branch | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  cashier: User | Types.ObjectId;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, enum: ['CASH', 'CARD', 'TRANSFER'], default: 'CASH' })
  paymentMethod: string;

  @Prop({ type: [SchemaFactory.createForClass(SaleItem)], required: true })
  items: SaleItem[];

  @Prop({ unique: true })
  ticketNumber: string; // Ej: INV-0001
}

export const SaleSchema = SchemaFactory.createForClass(Sale);