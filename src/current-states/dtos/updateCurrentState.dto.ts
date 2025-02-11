import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class UpdateCurrentStateDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  @Min(0)
  currentWeight?: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  @Min(40)
  currentHeight?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  currentAge?: number;
}
