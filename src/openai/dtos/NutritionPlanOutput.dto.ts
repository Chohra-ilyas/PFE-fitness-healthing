import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendedFoodDto {
  @IsNotEmpty()
  @IsString()
  foodType: string;

  @IsNotEmpty()
  @IsString()
  foodName: string;
}

export class NotRecommendedFoodDto {
  @IsNotEmpty()
  @IsString()
  foodType: string;

  @IsNotEmpty()
  @IsString()
  foodName: string;

  @IsNotEmpty()
  @IsString()
  reasonForNotRecommending: string;

  @IsNotEmpty()
  @IsString()
  problematicComponent: string;
}

export class NutritionPlanOutputDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  proteins: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  carbs: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(200)
  calories: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'recommendedFoods should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => RecommendedFoodDto)
  recommendedFoods: RecommendedFoodDto[];

  @IsArray()
  @ArrayNotEmpty({ message: 'notRecommendedFoods should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => NotRecommendedFoodDto)
  notRecommendedFoods: NotRecommendedFoodDto[];
}
