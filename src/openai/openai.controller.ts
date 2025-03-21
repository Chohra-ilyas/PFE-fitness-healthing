import { Controller, Post, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayload } from 'src/utils/types';
import { FitnessPlanOutputDto } from './dtos/FitnessPlanOutput.dto';

@Controller('api/openai-generate-plans')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('/workout-plans')
  @Roles(UserType.TRAINEE)
  @UseGuards(AuthRolesGuard)
  async generateWorkoutPlans(
    @CurrentUser() payload: JWTPayload,
  ): Promise<FitnessPlanOutputDto[]> {
    return this.openaiService.generateMultipleFitnessPlans(payload.id);
  }
}
