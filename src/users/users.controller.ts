import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JWTPayload } from 'src/utils/types';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

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

  @Post("update-profile-picture")
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file format'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
    }),
  )
  public async uploadFile(@CurrentUser() payload: JWTPayload,@UploadedFile() file: Express.Multer.File) {
    
    if (!file) throw new BadRequestException('No file provided');

    return this.usersService.updateProfilePicture(payload.id,file);
  }

  @Delete("delete-profile-picture")
  @UseGuards(AuthGuard)
  public async deleteProfilePicture(@CurrentUser() payload: JWTPayload) {
    return this.usersService.deleteProfilePicture(payload.id);
  }
}
