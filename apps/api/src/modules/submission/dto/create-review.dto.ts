import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  submissionId: string;

  @IsString()
  reviewer: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsBoolean()
  pass: boolean;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  easUid?: string;
}
