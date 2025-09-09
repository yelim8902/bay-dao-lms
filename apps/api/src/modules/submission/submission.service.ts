import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Review } from './entities/review.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const submission = this.submissionRepository.create(createSubmissionDto);
    return await this.submissionRepository.save(submission);
  }

  async findAllSubmissions(): Promise<Submission[]> {
    return await this.submissionRepository.find({
      relations: ['assignment', 'team', 'reviews'],
      order: { createdAt: 'DESC' },
    });
  }

  async findSubmissionById(id: string): Promise<Submission> {
    return await this.submissionRepository.findOne({
      where: { id },
      relations: ['assignment', 'team', 'reviews'],
    });
  }

  async findSubmissionsByAssignment(assignmentId: number): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: { assignmentId },
      relations: ['assignment', 'team', 'reviews'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findSubmissionsByStudent(student: string): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: { student },
      relations: ['assignment', 'team', 'reviews'],
      order: { submittedAt: 'DESC' },
    });
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
  }

  async findReviewsBySubmission(submissionId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { submissionId },
      relations: ['submission'],
      order: { reviewedAt: 'DESC' },
    });
  }
}
