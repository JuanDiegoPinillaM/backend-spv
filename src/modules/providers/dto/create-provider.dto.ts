import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({ example: 'Bavaria S.A.', description: 'Nombre de la empresa' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Carlos Vendedor', required: false })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ example: 'ventas@bavaria.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '3001234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Calle Industrial 123', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}