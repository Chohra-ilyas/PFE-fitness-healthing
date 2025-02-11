import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCurrentStateDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(0)
  currentWeight: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(40)
  currentHeight: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  currentAge: number;
}
