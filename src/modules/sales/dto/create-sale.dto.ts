import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsArray, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// Exportamos la clase para que Swagger la pueda leer en el esquema
export class SaleItemDto {
  @ApiProperty({ example: '698c9919c21b108017110807', description: 'ID del producto a vender' })
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @ApiProperty({ example: 2, description: 'Cantidad vendida', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @ApiProperty({ example: '698c8f55a5b667277ccf8dd5', description: 'Sede donde se realiza la venta' })
  @IsNotEmpty()
  @IsMongoId()
  branch: string;

  @ApiProperty({ 
    description: 'Lista de productos', 
    type: [SaleItemDto] // <--- ESTO ES CLAVE para que Swagger muestre el array
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiProperty({ enum: ['CASH', 'CARD', 'TRANSFER'], example: 'CASH' })
  @IsNotEmpty()
  @IsEnum(['CASH', 'CARD', 'TRANSFER'])
  paymentMethod: string;
}