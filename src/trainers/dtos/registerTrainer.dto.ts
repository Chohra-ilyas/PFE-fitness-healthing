import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Gender } from 'src/utils/enums';

export class RegisterTrainerDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'years must be a positive number' })
  experienceYears: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(30, { message: 'Maximum number of trainees is 30' })
  @Min(1, { message: 'Minimum number of trainees is 1' })
  maximumTrainees: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 300)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 300)
  specialization: string;
}
