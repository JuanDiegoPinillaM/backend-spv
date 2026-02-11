import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProviderDocument = Provider & Document;

@Schema({ timestamps: true })
export class Provider {
  @Prop({ required: true, trim: true, unique: true })
  name: string; // Ej: "Coca Cola Distribuidora"

  @Prop({ trim: true })
  contactName: string; // Ej: "Juan Vendedor"

  @Prop({ trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);