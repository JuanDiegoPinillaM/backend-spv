import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProvidersService } from '../services/providers.service';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Providers') // Para agrupar en Swagger
@ApiBearerAuth()      // Indica que requiere Token en Swagger
@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateData: Partial<CreateProviderDto>) {
    return this.providersService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER) // Quizás solo el Dueño debería poder borrar
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}