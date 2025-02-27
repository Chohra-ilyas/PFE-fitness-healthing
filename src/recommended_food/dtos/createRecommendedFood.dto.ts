import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateRecommendedFoodDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 255)
  foodType: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 255)
  foodName: string;

  @IsNumber()
  @IsNotEmpty()
  nutritionId: number;
}
