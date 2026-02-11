import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  // 2. Generar el Token JWT
  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role, branchId: user.branch };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        fullName: user.fullName,
        role: user.role,
        email: user.email
      }
    };
  }
}