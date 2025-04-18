import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Goal } from 'src/utils/enums';

class ChronicDiseaseItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'Chronic disease name must be between 2 and 100 characters',
  })
  chronicDiseaseName: string;
}

export class RegisterTraineeDto {

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsEnum(Goal)
  goal: Goal;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty({ message: 'chronicDiseases should not be empty' })
  @ValidateNested({ each: true })
  @Type(() => ChronicDiseaseItemDto)
  chronicDiseases?: ChronicDiseaseItemDto[];
}
