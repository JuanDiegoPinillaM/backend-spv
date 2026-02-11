import { IsNotEmpty, IsMongoId, IsArray, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @IsNotEmpty()
  @IsMongoId()
  branch: string; // La sede donde ocurre la venta

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsNotEmpty()
  @IsEnum(['CASH', 'CARD', 'TRANSFER'])
  paymentMethod: string;
}