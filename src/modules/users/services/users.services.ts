import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'; // Asegúrate de haber instalado bcrypt
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      // 1. Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // 2. Crear el usuario
      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword,
      });

      // 3. Retornar usuario sin mostrar la contraseña
      const { password: _, ...result } = user.toObject();
      return result;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('El correo electrónico ya existe');
      }
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  // Método auxiliar para buscar por email (lo usaremos en el Login)
  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}