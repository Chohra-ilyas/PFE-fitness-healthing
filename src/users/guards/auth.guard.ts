import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CURRENT_USER_KEY } from 'src/utils/constanst';
import { JWTPayload } from 'src/utils/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      try {
        const payload: JWTPayload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET'),
        });

        request[CURRENT_USER_KEY] = payload;
      } catch (error) {
        throw new UnauthorizedException('access denied,invalid token..!');
      }
    } else {
      throw new UnauthorizedException('access denied,no token provided..!');
    }
    return true;
  }
}
