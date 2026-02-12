import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.services';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Validar que el usuario existe y la contraseña coincide
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      if (!user.isActive) {
        throw new ForbiddenException('Cuenta inactiva o pendiente de aprobación');
      }
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user._id, 
      role: user.role, 
      branchId: user.branch,
      doc: user.documentNumber // Nuevo: incluir documento en el token
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        fullName: user.fullName,
        role: user.role,
        documentNumber: user.documentNumber, // Información para el estado de la PWA
        hiringDate: user.hiringDate
      }
    };
  }
}