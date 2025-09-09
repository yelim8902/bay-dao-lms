import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CohortService } from './cohort.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('cohorts')
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}

  @Post()
  async createCohort(@Body() createCohortDto: CreateCohortDto) {
    return await this.cohortService.createCohort(createCohortDto);
  }

  @Get()
  async findAllCohorts() {
    return await this.cohortService.findAllCohorts();
  }

  @Get(':cohortId')
  async findCohortById(@Param('cohortId') cohortId: string) {
    return await this.cohortService.findCohortById(cohortId);
  }

  @Post('teams')
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    return await this.cohortService.createTeam(createTeamDto);
  }

  @Get(':cohortId/teams')
  async findTeamsByCohort(@Param('cohortId') cohortId: string) {
    return await this.cohortService.findTeamsByCohort(cohortId);
  }

  @Get('teams/:teamId')
  async findTeamById(@Param('teamId') teamId: string) {
    return await this.cohortService.findTeamById(teamId);
  }

  @Post('teams/:teamId/members')
  async addTeamMember(
    @Param('teamId') teamId: string,
    @Body('memberAddress') memberAddress: string,
  ) {
    return await this.cohortService.addTeamMember(teamId, memberAddress);
  }

  @Get('user/:userAddress/teams')
  async getUserTeams(@Param('userAddress') userAddress: string) {
    return await this.cohortService.getUserTeams(userAddress);
  }
}
