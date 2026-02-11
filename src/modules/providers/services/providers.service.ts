import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderDocument } from '../schemas/provider.schema';
import { CreateProviderDto } from '../dto/create-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    try {
      return await this.providerModel.create(createProviderDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Ya existe un proveedor con ese nombre');
      }
      throw error;
    }
  }

  async findAll() {
    return this.providerModel.find({ isActive: true }).sort({ name: 1 });
  }

  async findOne(id: string) {
    const provider = await this.providerModel.findById(id);
    if (!provider) throw new NotFoundException('Proveedor no encontrado');
    return provider;
  }

  async update(id: string, updateData: Partial<CreateProviderDto>) {
    const updated = await this.providerModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new NotFoundException('Proveedor no encontrado');
    return updated;
  }

  async remove(id: string) {
    // Soft Delete (recomendado)
    return this.providerModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}