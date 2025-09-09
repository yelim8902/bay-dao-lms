import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async createAssignment(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create(createAssignmentDto);
    return await this.assignmentRepository.save(assignment);
  }

  async findAllAssignments(): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      relations: ['cohort'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAssignmentById(assignmentId: number): Promise<Assignment> {
    return await this.assignmentRepository.findOne({
      where: { assignmentId },
      relations: ['cohort', 'submissions'],
    });
  }

  async findAssignmentsByCohort(cohortId: string): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      where: { cohortId },
      relations: ['cohort'],
      order: { dueAt: 'ASC' },
    });
  }
}
