import { ApiProperty } from '@nestjs/swagger'; // <--- Importar esto
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo del usuario' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'juan@pos.com', uniqueItems: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CASHIER })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false, example: '698c...' })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiProperty({ example: 'CC', enum: ['CC', 'CE', 'PP'] })
  @IsEnum(['CC', 'CE', 'PP'])
  documentType: string;

  @ApiProperty({ example: '10203040' })
  @IsString()
  documentNumber: string;

  @ApiProperty({ example: '2024-02-12' })
  @IsDateString()
  hiringDate: string;

  @ApiProperty({ required: false, example: '2026-02-12' })
  @IsOptional()
  @IsDateString()
  terminationDate?: string;
}