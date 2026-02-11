import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@pos.com', 
    description: 'Correo electrónico registrado',
    required: true
  })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'passwordSecreto123', 
    description: 'Contraseña del usuario',
    required: true,
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}