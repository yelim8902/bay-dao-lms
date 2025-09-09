import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('cohorts')
export class Cohort {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cohortId: string; // bytes32 from contract

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['research', 'development'] })
  track: 'research' | 'development';

  @Column({ type: 'decimal', precision: 18, scale: 0 })
  depositAmount: string;

  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  endAt: Date;

  @Column({ type: 'int', default: 7000 }) // 70% in bps
  minPassRate: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => 'Team', 'cohort')
  teams: any[];

  @OneToMany(() => 'Assignment', 'cohort')
  assignments: any[];
}
