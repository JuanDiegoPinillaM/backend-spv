import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { BranchesService } from '../services/branches.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Controller('branches')
// 🔒 1. Todo este controlador requiere Token
@UseGuards(JwtAuthGuard, RolesGuard) 
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  // 🔒 2. Solo el DUEÑO puede crear sedes
  @Roles(UserRole.OWNER) 
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  // Todos los logueados pueden ver las sedes (para seleccionarlas)
  findAll() {
    return this.branchesService.findAll();
  }
}