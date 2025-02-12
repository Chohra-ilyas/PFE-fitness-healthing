import { IsNumber, Min } from 'class-validator';

export class CreateNutritionDto {
  @Min(10)
  @IsNumber()
  protein: number;
  
  @Min(10)
  @IsNumber()
  carb: number;

  @Min(200)
  @IsNumber()
  calories: number;
}
