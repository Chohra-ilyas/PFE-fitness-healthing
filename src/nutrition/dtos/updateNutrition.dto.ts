import {
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class updateNutritionDto {
  @Min(10)
  @IsOptional()
  @IsNumber()
  protein?: number;

  @Min(10)
  @IsOptional()
  @IsNumber()
  carb?: number;

  @Min(200)
  @IsOptional()
  @IsNumber()
  calories?: number;
}
