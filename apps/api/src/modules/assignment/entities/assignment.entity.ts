import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: number; // uint256 from contract

  @Column()
  cohortId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  dueAt: Date;

  @Column({ type: 'int', default: 100 }) // weight in percentage
  weight: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => 'Cohort', 'assignments')
  @JoinColumn({ name: 'cohortId' })
  cohort: any;

  @OneToMany(() => 'Submission', 'assignment')
  submissions: any[];
}
