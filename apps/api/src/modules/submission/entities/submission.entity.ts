import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: number;

  @Column()
  student: string; // wallet address

  @Column()
  teamId: string;

  @Column()
  cidHash: string; // IPFS CID hash

  @Column('text', { array: true, default: '{}' })
  links: string[]; // GitHub, Notion links

  @Column({ type: 'timestamp' })
  submittedAt: Date;

  @Column({ default: false })
  isLate: boolean;

  @Column({ type: 'enum', enum: ['pending', 'submitted', 'graded', 'late'], default: 'pending' })
  status: 'pending' | 'submitted' | 'graded' | 'late';

  @Column({ type: 'int', nullable: true })
  finalScore: number;

  @Column({ default: false })
  passed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => 'Assignment', 'submissions')
  @JoinColumn({ name: 'assignmentId' })
  assignment: any;

  @ManyToOne(() => 'Team', 'submissions')
  @JoinColumn({ name: 'teamId' })
  team: any;

  @OneToMany(() => 'Review', 'submission')
  reviews: any[];
}
