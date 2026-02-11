import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productModel.create(createProductDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('El SKU ya está registrado');
      }
      throw error;
    }
  }

  async findAll() {
    return this.productModel.find({ isActive: true });
  }
}