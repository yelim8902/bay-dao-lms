import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CohortModule } from './modules/cohort/cohort.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    CohortModule,
    AssignmentModule,
    SubmissionModule,
    CertificateModule,
    BlockchainModule,
  ],
})
export class AppModule {}
