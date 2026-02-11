import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Sale, SaleDocument, SaleItem } from '../schemas/sale.schema'; // Importamos SaleItem
import { CreateSaleDto } from '../dto/create-sale.dto';
import { Inventory, InventoryDocument } from '../../inventory/schemas/inventory.schema';
import { Product, ProductDocument } from '../../products/schemas/product.schema';
import { UserRole } from '../../users/schemas/user.schema'; // Importa el Enum de Roles

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createSaleDto: CreateSaleDto, cashierId: string, userBranchId: string, userRole: string) {
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
      
      // SOLUCIÓN 2: Tipamos explícitamente el array
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

        // SOLUCIÓN 1: Usamos 'price' en lugar de 'basePrice'
        const subtotal = product.price * item.quantity; 
        totalSale += subtotal;

        saleItems.push({
          product: item.product as any, // Cast simple por si Mongoose se queja del tipo ObjectId vs Document
          quantity: item.quantity,
          price: product.price, // Aquí también corregido a 'price'
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