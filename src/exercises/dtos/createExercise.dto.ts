import {  
    IsNotEmpty,  
    IsNumber,  
    IsString,  
    IsOptional,   
  } from 'class-validator';  
import { IsStringOrNumber } from 'src/users/decorators/stringOrnumber.decorator';
  
  
  
  export class CreateExerciseDto {  
    @IsNotEmpty()  
    @IsString()  
    exerciseName: string;  
  
    @IsOptional()  
    @IsNumber()  
    exerciseSets?: number;  
  
    @IsOptional()  
    @IsStringOrNumber({ message: 'exerciseReps must be a string or number' })  
    exerciseReps?: string | number;  
  
    @IsNotEmpty()  
    @IsNumber()  
    dayId: number;  
  }  
  