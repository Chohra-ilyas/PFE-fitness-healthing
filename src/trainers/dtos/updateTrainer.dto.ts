import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
  } from 'class-validator';
import { Gender } from 'src/utils/enums';
  
  export class UpdateTrainerDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(0, { message: 'years must be a positive number' })
    experienceYears?: number;
  
    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    @Max(30, { message: 'Maximum number of trainees is 30' })
    @Min(1, { message: 'Minimum number of trainees is 1' })
    maximumTrainees?: number;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    gender?: Gender;
  
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Length(10, 300)
    description?: string;
  
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Length(5, 300)
    specialization?: string;
  }
  