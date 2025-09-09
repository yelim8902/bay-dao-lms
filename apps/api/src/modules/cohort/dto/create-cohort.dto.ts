import { IsString, IsEnum, IsNumber, IsDateString, IsOptional, Min, Max } from 'class-validator';

export class CreateCohortDto {
  @IsString()
  cohortId: string;

  @IsString()
  name: string;

  @IsEnum(['research', 'development'])
  track: 'research' | 'development';

  @IsString()
  depositAmount: string;

  @IsDateString()
  startAt: Date;

  @IsDateString()
  endAt: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  minPassRate?: number = 7000; // 70% default
}
