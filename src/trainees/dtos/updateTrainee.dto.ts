import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Goal } from 'src/utils/enums';

export class UpdateTraineeDto {

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  height: number;

  @IsEnum(Goal)
  @IsOptional()
  goal: Goal;
}
