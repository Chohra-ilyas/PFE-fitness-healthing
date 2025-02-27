import { IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class CreateNotRecommendedFoodDto {
  @IsString()
  @IsNotEmpty()
  foodName: string;

  @IsString()
  @IsNotEmpty()
  foodType: string;

  @IsString()
  @IsNotEmpty()
  reasonForNotRecommending: string;

  @IsString()
  @IsNotEmpty()
  problematicComponent: string;

  @IsNumber()
  @IsNotEmpty()
  nutritionId: number;
}
