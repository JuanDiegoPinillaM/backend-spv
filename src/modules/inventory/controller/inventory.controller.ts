import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { AddStockDto } from '../dto/create-inventory.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('add')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Agregar stock a una sede' })
  addStock(@Body() addStockDto: AddStockDto) {
    return this.inventoryService.addStock(addStockDto);
  }

  @Get(':branchId')
  @ApiOperation({ summary: 'Ver inventario de una sede' })
  findByBranch(@Param('branchId') branchId: string) {
    return this.inventoryService.findByBranch(branchId);
  }
  
  // 🆕 NUEVO ENDPOINT: Para que el POS obtenga productos con stock
  @Get('pos/:branchId')
  @Roles(UserRole.CASHIER, UserRole.MANAGER, UserRole.OWNER)
  @ApiOperation({ summary: 'Obtener productos disponibles para POS con stock de la sede' })
  findForPOS(@Param('branchId') branchId: string) {
    return this.inventoryService.findForPOS(branchId);
  }

  // 🆕 ALTERNATIVA: Usar el branchId del usuario autenticado
  @Get('pos/my-branch/products')
  @Roles(UserRole.CASHIER, UserRole.MANAGER, UserRole.OWNER)
  @ApiOperation({ summary: 'Obtener productos de MI sede (usa el branchId del token)' })
  findForMyBranch(@Request() req) {
    return this.inventoryService.findForPOS(req.user.branchId);
  }
  
  @Get(':branchId/alerts')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Ver productos con stock bajo' })
  findLowStock(@Param('branchId') branchId: string) {
    return this.inventoryService.findLowStock(branchId);
  }
}