import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SalesService } from '../services/sales.service';
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
}