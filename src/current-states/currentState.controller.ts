import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentStateService } from './currentState.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { CreateCurrentStateDto } from './dtos/currentState.dto';
import { JWTPayload } from 'src/utils/types';
import { UpdateCurrentStateDto } from './dtos/updateCurrentState.dto';

@Controller('api/current-states')
export class CurrentStateController {
  constructor(private readonly currentStateService: CurrentStateService) {}

  @Post('')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async createNewCurrentState(
    @CurrentUser() payload: JWTPayload,
    @Body() currentState: CreateCurrentStateDto,
  ) {
    return this.currentStateService.addNewCurrentState(
      payload.id,
      currentState,
    );
  }

  @Get('myCurrentState')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async getMyCurrentState(@CurrentUser() payload: JWTPayload) {
    return this.currentStateService.getAllTraineeCurrentState(payload.id);
  }

  @Put(':currentStateId')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async updateCurrentState(
    @CurrentUser() payload: JWTPayload,
    @Body() currentState: UpdateCurrentStateDto,
    @Param('currentStateId', ParseIntPipe) currentStateId: number,
  ) {
    return this.currentStateService.updateCurrentState(
      payload.id,
      currentStateId,
      currentState,
    );
  }

  @Get(':currentStateId')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async getCurrentState(
    @CurrentUser() payload: JWTPayload,
    @Param('currentStateId', ParseIntPipe) currentStateId: number,
  ) {
    return this.currentStateService.getSingleCurrentState(payload.id, currentStateId);
  }

  @Delete(':currentStateId')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  public async deleteCurrentState(
    @CurrentUser() payload: JWTPayload,
    @Param('currentStateId', ParseIntPipe) currentStateId: number,
  ) {
    return this.currentStateService.deleteCurrentState(payload.id, currentStateId);
  }
}
