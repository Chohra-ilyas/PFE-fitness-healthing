import { IsString, IsNotEmpty, IsNumber, Length, IsOptional } from 'class-validator';

export class updateRecommendedFoodDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  foodType?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  foodName?: string;
}
