import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './services/providers.service';
import { ProvidersController } from './controller/providers.controller';
import { Provider, ProviderSchema } from './schemas/provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService], // Exportamos por si Productos necesita validar proveedores
})
export class ProvidersModule {}