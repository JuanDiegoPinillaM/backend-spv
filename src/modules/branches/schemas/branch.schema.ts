// src/modules/branches/schemas/branch.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true }) // Agrega createdAt y updatedAt automáticamente
export class Branch {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: true })
  isActive: boolean; // Soft delete: nunca borres una sede, solo desactívala.
}

export const BranchSchema = SchemaFactory.createForClass(Branch);