import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { Submission } from './entities/submission.entity';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Review])],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
