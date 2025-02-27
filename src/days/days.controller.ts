import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DaysService } from './days.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { CreateDayDto } from './dtos/createDay.dto';
import { UpdateDayDto } from './dtos/updateDay.dto';

@Controller('api/days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}
  @Post()
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async createDay(
    @CurrentUser() payload: JWTPayload,
    @Body() newDay: CreateDayDto,
  ) {
    return this.daysService.createDay(payload.id, newDay);
  }

  @Put('/:dayId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async updateDay(
    @CurrentUser() payload: JWTPayload,
    @Param('dayId', ParseIntPipe) dayId: number,
    @Body() updateDay: UpdateDayDto,
  ) {
    return this.daysService.updateDay(payload.id, dayId, updateDay);
  }

  @Delete('/:dayId')
  @Roles(UserType.TRAINER)
  @UseGuards(AuthRolesGuard)
  public async deleteDay(
    @CurrentUser() payload: JWTPayload,
    @Param('dayId') dayId: number,
  ) {
    return this.daysService.deleteDay(payload.id, dayId);
  }
}
