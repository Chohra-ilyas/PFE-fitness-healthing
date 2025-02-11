import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JWTPayload } from 'src/utils/types';
import { UserType } from 'src/utils/enums';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthRolesGuard } from './guards/auth-role.guard';
import { Roles } from './decorators/user-role.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //POST: ~/api/users/auth/registerUser
  @Post('auth/registerUser')
  async register(@Body() body: RegisterUserDto) {
    return this.usersService.register(body);
  }

  //POST: ~/api/users/auth/login
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }

  //GET: ~/api/users/current-user
  @Get('current-user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() payload: JWTPayload) {
    return this.usersService.getCurrentUser(payload.id);
  }

}
