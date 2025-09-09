import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from './entities/cohort.entity';
import { Team } from './entities/team.entity';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class CohortService {
  constructor(
    @InjectRepository(Cohort)
    private cohortRepository: Repository<Cohort>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async createCohort(createCohortDto: CreateCohortDto): Promise<Cohort> {
    const cohort = this.cohortRepository.create(createCohortDto);
    return await this.cohortRepository.save(cohort);
  }

  async findAllCohorts(): Promise<Cohort[]> {
    return await this.cohortRepository.find({
      relations: ['teams'],
      order: { createdAt: 'DESC' },
    });
  }

  async findCohortById(cohortId: string): Promise<Cohort> {
    return await this.cohortRepository.findOne({
      where: { cohortId },
      relations: ['teams', 'assignments'],
    });
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create(createTeamDto);
    return await this.teamRepository.save(team);
  }

  async findTeamsByCohort(cohortId: string): Promise<Team[]> {
    return await this.teamRepository.find({
      where: { cohortId },
      relations: ['cohort'],
    });
  }

  async findTeamById(teamId: string): Promise<Team> {
    return await this.teamRepository.findOne({
      where: { teamId },
      relations: ['cohort'],
    });
  }

  async addTeamMember(teamId: string, memberAddress: string): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { teamId } });
    if (!team) {
      throw new Error('Team not found');
    }

    if (team.members.includes(memberAddress)) {
      throw new Error('Member already in team');
    }

    if (team.members.length >= 5) {
      throw new Error('Team is full');
    }

    team.members.push(memberAddress);
    return await this.teamRepository.save(team);
  }

  async getUserTeams(userAddress: string): Promise<Team[]> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .where('team.leader = :address OR :address = ANY(team.members)', { address: userAddress })
      .leftJoinAndSelect('team.cohort', 'cohort')
      .getMany();
  }
}
