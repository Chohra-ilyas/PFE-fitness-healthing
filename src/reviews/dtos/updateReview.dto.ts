import { IsString, IsOptional, IsNumber, Min, Max, Length } from 'class-validator';

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    comment?: string;
}