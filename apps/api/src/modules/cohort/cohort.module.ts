import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CohortController } from './cohort.controller';
import { CohortService } from './cohort.service';
import { Cohort } from './entities/cohort.entity';
import { Team } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cohort, Team])],
  controllers: [CohortController],
  providers: [CohortService],
  exports: [CohortService],
})
export class CohortModule {}
