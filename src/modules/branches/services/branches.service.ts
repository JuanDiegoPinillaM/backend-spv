import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from '../schemas/branch.schema';
import { CreateBranchDto } from '../dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<BranchDocument>) {}

  async create(createBranchDto: CreateBranchDto) {
    try {
      return await this.branchModel.create(createBranchDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Ya existe una sede con ese nombre');
      }
      throw error;
    }
  }

  async findAll() {
    return this.branchModel.find({ isActive: true });
  }
}