import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose'; // Asegúrate de importar Types
import { Sale, SaleDocument, SaleItem } from '../schemas/sale.schema';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Inventory, InventoryDocument } from '../../inventory/schemas/inventory.schema';
import { Product, ProductDocument } from '../../products/schemas/product.schema';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  // 1. Listar Ventas (Dinámico)
  async findAll(branchId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // Filtro dinámico: Si hay branchId, filtra. Si no, objeto vacío (trae todo)
    const filter = branchId ? { branch: branchId } : {};

    const sales = await this.saleModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('branch', 'name') // Agregué esto para saber de qué sede es la venta en la lista global
      .populate('cashier', 'fullName email')
      .populate('items.product', 'name sku')
      .exec();

    const total = await this.saleModel.countDocuments(filter);

    return {
      data: sales,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    };
  }

  async findOne(id: string) {
    const sale = await this.saleModel.findById(id)
      .populate('branch', 'name address')
      .populate('cashier', 'fullName')
      .populate('items.product', 'name price image')
      .exec();

    if (!sale) throw new NotFoundException('Venta no encontrada');
    return sale;
  }

  // 3. Resumen Rápido (Dinámico)
  async getDailySummary(branchId?: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const matchStage: any = {
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    };

    if (branchId) {
      // FIX: Intentamos buscar tanto por ObjectId como por String para asegurar compatibilidad
      matchStage.$or = [
          { branch: new Types.ObjectId(branchId) }, // Si se guardó bien (ObjectId)
          { branch: branchId }                      // Si se guardó mal (String)
      ];
    }

    const result = await this.saleModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { totalAmount: 0, count: 0 };
  }

  // ... (El método create se mantiene igual) ...
  async create(createSaleDto: CreateSaleDto, cashierId: string, userBranchId: string, userRole: string) {
     // ... tu código create existente ...
     if (userRole !== UserRole.OWNER) {
      if (createSaleDto.branch !== userBranchId) {
        throw new ForbiddenException(
          'Acceso denegado: No puedes registrar ventas en una sede diferente a la asignada.'
        );
      }
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { branch, items, paymentMethod } = createSaleDto;
      let totalSale = 0;
      
      const saleItems: SaleItem[] = []; 

      for (const item of items) {
        const product = await this.productModel.findById(item.product).session(session);
        
        if (!product) {
          throw new NotFoundException(`El producto con ID ${item.product} no existe.`);
        }

        const inventory = await this.inventoryModel.findOne({ 
            branch: branch, 
            product: item.product 
        }).session(session);

        if (!inventory) {
          throw new BadRequestException(`El producto ${product.name} no está registrado en el inventario de esta sede.`);
        }

        if (inventory.stock < item.quantity) {
          throw new BadRequestException(`Stock insuficiente para ${product.name}. Disponible: ${inventory.stock}, Solicitado: ${item.quantity}`);
        }

        inventory.stock -= item.quantity;
        await inventory.save({ session });

        const subtotal = product.price * item.quantity; 
        totalSale += subtotal;

        saleItems.push({
          product: item.product as any, 
          quantity: item.quantity,
          price: product.price, 
          subtotal,
        });
      }

      const newSale = new this.saleModel({
        branch,
        cashier: cashierId,
        items: saleItems,
        total: totalSale,
        paymentMethod,
        ticketNumber: `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });

      await newSale.save({ session });
      await session.commitTransaction();
      
      return newSale;

    } catch (error) {
      await session.abortTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Error al procesar la venta.');
    } finally {
      session.endSession();
    }
  }
}