import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateDayDto {
  @IsOptional()
  @IsString({ message: 'Day name must be a string' })
  dayName?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Day number must be a number' })
  @Min(1, { message: 'Day number must be at least 1' })
  @Max(31, { message: 'Day number cannot exceed 31' })
  dayNumber?: number;

}