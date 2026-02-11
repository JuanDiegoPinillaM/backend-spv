import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto'; // <--- 1. Importar el DTO
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // <--- 2. Importar Swagger

@ApiTags('Auth') // Agrupa este controlador en una sección llamada "Auth"
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener Token JWT' }) // Descripción del endpoint
  @ApiResponse({ status: 201, description: 'Login exitoso, retorna el token.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginDto: LoginDto) { 
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }
}