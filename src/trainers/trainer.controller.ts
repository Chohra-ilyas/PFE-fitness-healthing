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
import { RegisterTrainerDto } from './dtos/registerTrainer.dto';
import { TrainerService } from './trainer.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { Trainer } from './entities/trainer.entity';
import { UpdateTrainerDto } from './dtos/updateTrainer.dto';

@Controller('api/trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  //POST: ~/api/users/auth/registerTrainer
  @Post('auth/registerTrainer')
  @UseGuards(AuthGuard)
  async registerTrainer(
    @Body() body: RegisterTrainerDto,
    @CurrentUser() payload: JWTPayload,
  ) {
    return this.trainerService.registerTrainer(body, payload.id);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllTrainees(): Promise<Trainer[]> {
    return await this.trainerService.getAllTrainers();
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  async getTraineeByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Trainer> {
    return await this.trainerService.getTrainerByUserId(userId);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateTrainer(
    @CurrentUser() payload: JWTPayload,
    @Body() body: UpdateTrainerDto,
  ) {
    return this.trainerService.updateTrainer(payload.id, body);
  }
}
