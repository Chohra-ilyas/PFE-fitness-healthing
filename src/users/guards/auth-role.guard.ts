import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CURRENT_USER_KEY } from 'src/utils/constanst';
import { UserType } from 'src/utils/enums';
import { JWTPayload } from 'src/utils/types';
import { UsersService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const role: UserType[] = this.reflector.getAllAndOverride('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role || role.length === 0) return false;

    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      try {
        const payload: JWTPayload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET'),
        });

        const user = await this.userService.getCurrentUser(payload.id);
        if (!user) throw new UnauthorizedException('user does not exist');

        if (role.includes(user.userType) && payload.userType ) {
          request[CURRENT_USER_KEY] = payload;
          return true;
        }
        
      } catch (error) {
        throw new UnauthorizedException('access denied,invalid token..!');
      }
    } else {
      throw new UnauthorizedException('access denied,no token provided..!');
    }
    return false;
  }
}
