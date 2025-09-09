import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Submission } from './submission.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  submissionId: string;

  @Column()
  reviewer: string; // wallet address

  @Column({ type: 'int' })
  score: number; // 0-100

  @Column({ default: false })
  pass: boolean;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ nullable: true })
  easUid: string; // EAS attestation UID

  @Column({ type: 'timestamp' })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Submission, 'reviews')
  @JoinColumn({ name: 'submissionId' })
  submission: Submission;
}
