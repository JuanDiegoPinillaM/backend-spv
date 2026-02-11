import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { BranchesController } from './controller/branches.controller';
import { BranchesService } from './services/branches.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }])],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService] // Exportamos por si otros módulos necesitan validar sedes
})
export class BranchesModule {}