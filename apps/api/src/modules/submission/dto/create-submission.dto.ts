import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsNumber()
  assignmentId: number;

  @IsString()
  student: string;

  @IsString()
  teamId: string;

  @IsString()
  cidHash: string;

  @IsArray()
  @IsString({ each: true })
  links: string[];
}
