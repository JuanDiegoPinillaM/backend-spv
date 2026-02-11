import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { AddStockDto } from '../dto/create-inventory.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('add')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  addStock(@Body() addStockDto: AddStockDto) {
    return this.inventoryService.addStock(addStockDto);
  }

  @Get(':branchId')
  // Todos pueden ver el stock (incluso cajeros para consultar precios/existencia)
  findByBranch(@Param('branchId') branchId: string) {
    return this.inventoryService.findByBranch(branchId);
  }
  
  @Get(':branchId/alerts')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  findLowStock(@Param('branchId') branchId: string) {
      return this.inventoryService.findLowStock(branchId);
  }
}