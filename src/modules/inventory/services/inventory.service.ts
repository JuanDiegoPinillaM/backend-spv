import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from '../schemas/inventory.schema';
import { AddStockDto } from '../dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
  ) {}

  // 1. Agregar Stock (Entrada de mercancía)
  async addStock(addStockDto: AddStockDto) {
    const { branch, product, quantity } = addStockDto;

    // Busca por Sede + Producto. Si existe suma, si no crea.
    return this.inventoryModel.findOneAndUpdate(
      { branch, product },
      { 
        $inc: { stock: quantity }, // Incrementa el stock existente
        $setOnInsert: { minStock: 5 } // Solo si es nuevo, pone alerta en 5 por defecto
      },
      { new: true, upsert: true } // Opciones clave
    ).populate('product', 'name sku price'); // Devuelve datos del producto para verlos en el frontend
  }

  // 2. Ver inventario de una sede específica
  async findByBranch(branchId: string) {
    return this.inventoryModel.find({ branch: branchId })
      .populate('product', 'name sku image price category') // "Join" con productos
      .exec();
  }
  
  // 🆕 3. Obtener productos con stock para el POS (formato optimizado)
  async findForPOS(branchId: string) {
    const inventory = await this.inventoryModel
      .find({ branch: branchId })
      .populate('product', 'name sku price image isActive') // Traer todos los datos del producto
      .exec();

    // Transformar para que el frontend tenga un formato más simple
    // En lugar de: { product: { _id, name }, stock: 10 }
    // Devolvemos: { _id, name, sku, price, stock }
    return inventory
      .filter(item => {
        // Solo productos activos
        const product = item.product as any;
        return product?.isActive !== false;
      })
      .map(item => {
        const product = item.product as any;
        return {
          _id: product._id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: item.stock,
          minStock: item.minStock,
          inventoryId: item._id // Por si necesitas referencia al inventario
        };
      });
  }
  
  // 4. Ver alerta de stock bajo
  async findLowStock(branchId: string) {
    return this.inventoryModel.find({ 
      branch: branchId,
      $expr: { $lte: ["$stock", "$minStock"] } // Donde stock <= minStock
    }).populate('product');
  }
}