import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RegisterTraineeDto } from './dtos/registerTrainee.dto';
import { TraineeService } from './trainee.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Trainee } from './entities/trainee.entity';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { UpdateTraineeDto } from './dtos/updateTrainee.dto';

@Controller('api/trainees')
export class TraineeController {
  constructor(private readonly traineeService: TraineeService) {}

  //POST: ~/api/users/auth/registerTrainer
  @Post('auth/registerTrainee')
  @UseGuards(AuthGuard)
  async registerTrainee(
    @Body() body: RegisterTraineeDto,
    @CurrentUser() payload: JWTPayload,
  ) {
    return this.traineeService.registerTrainee(body, payload.id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllTrainees(): Promise<Trainee[]> {
    return await this.traineeService.getAllTrainees();
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  async getTraineeByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Trainee> {
    return await this.traineeService.getTraineeByUserId(userId);
  }

  @Put()
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  async updateTrainee(
    @CurrentUser() payload: JWTPayload,
    @Body() body: UpdateTraineeDto,
  ) {
    return this.traineeService.updateTrainee(payload.id, body);
  }

  @Put('assignTrainer/:trainerId')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  async assignTrainer(
    @CurrentUser() payload: JWTPayload,
    @Param('trainerId', ParseIntPipe) trainerId: number,
  ) {
    return this.traineeService.assignTrainer(payload.id, trainerId);
  }
}
