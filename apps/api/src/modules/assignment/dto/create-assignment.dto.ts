import { IsString, IsNumber, IsDateString, IsOptional, Min, Max } from 'class-validator';

export class CreateAssignmentDto {
  @IsNumber()
  assignmentId: number;

  @IsString()
  cohortId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dueAt: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  weight?: number = 100;
}
