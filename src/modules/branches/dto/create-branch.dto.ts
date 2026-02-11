import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Sede Centro - Principal', description: 'Nombre identificador de la sede' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', description: 'Dirección física' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono de contacto' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}