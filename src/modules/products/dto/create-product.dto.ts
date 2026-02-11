import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '770123456789', description: 'Código de barras único (SKU)' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Coca Cola 1.5L', description: 'Nombre comercial del producto' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bebida gaseosa sabor cola', required: false, description: 'Detalle opcional' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5500, description: 'Precio base de venta', minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Bebidas', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}