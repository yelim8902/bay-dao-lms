import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  teamId: string;

  @IsString()
  cohortId: string;

  @IsString()
  name: string;

  @IsString()
  leader: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[] = [];
}
