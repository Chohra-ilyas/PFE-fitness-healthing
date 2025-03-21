import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ChronicDiseaseDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, {
    message: 'Chronic disease name must be between 2 and 100 characters',
  })
  chronicDiseaseName: string;
}
