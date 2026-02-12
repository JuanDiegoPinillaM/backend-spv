// src/modules/users/services/users.services.ts

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // ==========================================
  // CREAR USUARIO (Con Logs de Depuración)
  // ==========================================
  async create(createUserDto: CreateUserDto, currentUser: any) {
    try {
      console.log('--- INTENTO DE CREACIÓN ---');
      console.log('Quién crea:', currentUser.email, 'Rol:', currentUser.role);
      console.log('Sede del creador:', currentUser.branchId);

      if (currentUser.role === UserRole.MANAGER && createUserDto.role === UserRole.OWNER) {
        throw new ForbiddenException('Un Manager no puede crear un Owner');
      }

      let isActive = true;
      let branch = createUserDto.branchId;

      if (currentUser.role === UserRole.MANAGER) {
        // Forzamos la sede y el estado inactivo
        branch = currentUser.branchId; 
        isActive = false; 
      }

      console.log('Datos finales a guardar -> Branch:', branch, 'Active:', isActive);

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.userModel.create({
        ...createUserDto,
        branch: branch,     
        isActive: isActive, 
        password: hashedPassword,
      });

      console.log('✅ Usuario creado en BD con ID:', user._id);
      
      const { password: _, ...result } = user.toObject();
      return result;

    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      if (error.code === 11000) throw new BadRequestException('El correo o documento ya existe');
      throw error;
    }
  }

  // ==========================================
  // LISTAR USUARIOS (Consulta Simplificada)
  // ==========================================
  async findAll(currentUser: any) {
    const filter: any = {};

    if (currentUser.role === UserRole.MANAGER) {
      if (!currentUser.branchId) {
        throw new ForbiddenException('Error de seguridad: No tienes sede asignada en tu sesión.');
      }
      
      // CORRECCIÓN: Quitamos "new Types.ObjectId()"
      // Dejamos que Mongoose haga el casting automático del string.
      // Esto evita errores si el ID viene con formato ligeramente distinto.
      filter.branch = currentUser.branchId;
    }

    console.log('🔍 Buscando usuarios con filtro:', JSON.stringify(filter));

    const users = await this.userModel.find(filter)
      .select('-password')
      .populate('branch', 'name')
      .exec(); // Agregamos .exec() por buena práctica
      
    console.log(`📊 Encontrados: ${users.length} usuarios`);
    return users;
  }

  // ==========================================
  // ACTUALIZAR USUARIO
  // ==========================================
  async update(id: string, updateData: any, currentUser: any) {
    const userToUpdate = await this.userModel.findById(id);
    if (!userToUpdate) throw new NotFoundException('Usuario no encontrado');

    // REGLA MANAGER: Solo edita su gente
    if (currentUser.role === UserRole.MANAGER) {
      if (userToUpdate.branch?.toString() !== currentUser.branchId) {
        throw new ForbiddenException('No tienes permiso para editar usuarios de otra sede');
      }
      // El Manager NO puede cambiar la sede ni el rol, ni activarse a sí mismo si fue desactivado
      delete updateData.branchId; 
      delete updateData.role;
      delete updateData.isActive; // Solo el Owner aprueba/activa
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  // ==========================================
  // ELIMINAR (SOFT DELETE)
  // ==========================================
  async remove(id: string, currentUser: any) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // REGLA MANAGER: Solo desactiva a los de su sede
    if (currentUser.role === UserRole.MANAGER) {
       if (user.branch?.toString() !== currentUser.branchId) {
         throw new ForbiddenException('No es tu empleado');
       }
    }

    // 🔥 CAMBIO CRÍTICO: NO BORRAMOS, SOLO DESACTIVAMOS
    // Tanto Owner como Manager solo realizan "Soft Delete"
    user.isActive = false;
    return user.save();
  }
}