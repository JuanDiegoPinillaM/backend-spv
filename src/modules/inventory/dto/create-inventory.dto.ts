import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class AddStockDto {
  @ApiProperty({ example: '698c9919c21b108017110807', description: 'ID del Producto (MongoID)' })
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @ApiProperty({ example: '698c8f55a5b667277ccf8dd5', description: 'ID de la Sede (MongoID)' })
  @IsNotEmpty()
  @IsMongoId()
  branch: string;

  @ApiProperty({ example: 50, description: 'Cantidad a ingresar', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}