import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async createSubmission(@Body() createSubmissionDto: CreateSubmissionDto) {
    return await this.submissionService.createSubmission(createSubmissionDto);
  }

  @Get()
  async findAllSubmissions() {
    return await this.submissionService.findAllSubmissions();
  }

  @Get(':id')
  async findSubmissionById(@Param('id') id: string) {
    return await this.submissionService.findSubmissionById(id);
  }

  @Get('assignment/:assignmentId')
  async findSubmissionsByAssignment(@Param('assignmentId') assignmentId: number) {
    return await this.submissionService.findSubmissionsByAssignment(assignmentId);
  }

  @Get('student/:student')
  async findSubmissionsByStudent(@Param('student') student: string) {
    return await this.submissionService.findSubmissionsByStudent(student);
  }

  @Post('reviews')
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return await this.submissionService.createReview(createReviewDto);
  }

  @Get(':submissionId/reviews')
  async findReviewsBySubmission(@Param('submissionId') submissionId: string) {
    return await this.submissionService.findReviewsBySubmission(submissionId);
  }
}
