import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.services';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@ApiTags('Users')
@ApiBearerAuth() // 🔒 Requiere Token
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegemos el controlador completo
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario (Solo Owner/Manager)' })
  // Solo los dueños o gerentes pueden registrar empleados
  @Roles(UserRole.OWNER, UserRole.MANAGER) 
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}