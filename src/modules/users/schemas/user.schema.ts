// src/modules/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Branch } from '../../branches/schemas/branch.schema';

export type UserDocument = User & Document;

export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Recuerda hashear esto con bcrypt antes de guardar

  @Prop({ required: true, enum: UserRole, default: UserRole.CASHIER })
  role: string;

  @Prop({ required: true, enum: ['CC', 'CE', 'PP', 'NIT'], default: 'CC' })
  documentType: string;

  @Prop({ required: true, unique: true })
  documentNumber: string;

  @Prop({ required: true })
  hiringDate: Date; // Fecha de ingreso

  @Prop({ required: false })
  terminationDate?: Date; // Fecha de salida (opcional)

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: false })
  branch: Branch | Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);