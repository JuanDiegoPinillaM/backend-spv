import {  Controller, Post, Get, Body, Param, Query, UseGuards, Request, ForbiddenException, ParseIntPipe } from '@nestjs/common';import { SalesService } from '../services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.CASHIER, UserRole.MANAGER, UserRole.OWNER)
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    // Pasamos el contexto completo de seguridad: ID, Sede del Token y Rol
    return this.salesService.create(
      createSaleDto, 
      req.user.userId, 
      req.user.branchId, // <--- Este viene del Token (Inmutable)
      req.user.role      // <--- Este viene del Token (Inmutable)
    );
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('branchId') queryBranchId?: string
  ) {
    let targetBranchId = req.user.branchId;

    // Si es OWNER, usamos el query param. Si no manda nada, targetBranchId será undefined (y eso está bien, significa "todo")
    if (req.user.role === UserRole.OWNER) {
      targetBranchId = queryBranchId; 
    }

    // Eliminamos el "if (!targetBranchId) return []" para permitir búsquedas globales
    return this.salesService.findAll(targetBranchId, page, limit);
  }

  @Get('dashboard/summary')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  getSummary(@Request() req, @Query('branchId') queryBranchId?: string) {
    let targetBranchId = req.user.branchId;
    if (req.user.role === UserRole.OWNER) targetBranchId = queryBranchId;

    return this.salesService.getDailySummary(targetBranchId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }
}