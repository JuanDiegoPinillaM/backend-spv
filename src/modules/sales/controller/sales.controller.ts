import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SalesService } from '../services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'; // <--- Importar ApiQuery

@ApiTags('Sales')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.CASHIER, UserRole.MANAGER, UserRole.OWNER)
  @ApiOperation({ summary: 'Registrar una nueva venta' })
  create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    return this.salesService.create(
      createSaleDto, 
      req.user.userId, 
      req.user.branchId, 
      req.user.role      
    );
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Historial de ventas (Paginado)' })
  // 👇 DOCUMENTACIÓN PARA SWAGGER
  @ApiQuery({ name: 'branchId', required: false, description: 'Filtrar por sede (Opcional para Owner)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('branchId') queryBranchId?: string
  ) {
    let targetBranchId = req.user.branchId;
    if (req.user.role === UserRole.OWNER) {
      targetBranchId = queryBranchId; 
    }
    return this.salesService.findAll(targetBranchId, page, limit);
  }

  @Get('dashboard/summary')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @ApiOperation({ summary: 'Resumen financiero del día' })
  @ApiQuery({ name: 'branchId', required: false, description: 'ID de la sede (Dejar vacío para ver Global)' })
  getSummary(@Request() req, @Query('branchId') queryBranchId?: string) {
    let targetBranchId = req.user.branchId;
    
    // Si es Owner, permitimos que elija sede o vea todo (undefined)
    if (req.user.role === UserRole.OWNER) {
        targetBranchId = queryBranchId; 
    }

    return this.salesService.getDailySummary(targetBranchId);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER)
  @ApiOperation({ summary: 'Ver detalle de un ticket' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }
}