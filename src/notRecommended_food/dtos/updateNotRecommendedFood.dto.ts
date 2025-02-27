import { IsString, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class UpdateNotRecommendedFoodDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  foodName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  foodType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reasonForNotRecommending?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  problematicComponent?: string;
}
