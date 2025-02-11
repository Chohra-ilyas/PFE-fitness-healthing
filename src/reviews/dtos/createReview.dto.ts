import { IsInt, IsString, Max, Min, Length } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(1, 255)
  comment: string;
}
