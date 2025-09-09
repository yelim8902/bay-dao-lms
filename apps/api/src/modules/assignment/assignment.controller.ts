import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    return await this.assignmentService.createAssignment(createAssignmentDto);
  }

  @Get()
  async findAllAssignments() {
    return await this.assignmentService.findAllAssignments();
  }

  @Get(':assignmentId')
  async findAssignmentById(@Param('assignmentId') assignmentId: number) {
    return await this.assignmentService.findAssignmentById(assignmentId);
  }

  @Get('cohort/:cohortId')
  async findAssignmentsByCohort(@Param('cohortId') cohortId: string) {
    return await this.assignmentService.findAssignmentsByCohort(cohortId);
  }
}
