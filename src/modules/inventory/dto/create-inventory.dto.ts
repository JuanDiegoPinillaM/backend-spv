import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class AddStockDto {
  @IsNotEmpty()
  @IsMongoId()
  product: string; // ID del producto del catálogo global

  @IsNotEmpty()
  @IsMongoId()
  branch: string; // ID de la sede a la que entra

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number; // Cuánto entra
}