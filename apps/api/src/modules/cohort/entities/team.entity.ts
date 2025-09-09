import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  teamId: string; // bytes32 from contract

  @Column()
  cohortId: string;

  @Column()
  name: string;

  @Column()
  leader: string; // wallet address

  @Column('text', { array: true, default: '{}' })
  members: string[]; // wallet addresses

  @Column({ default: false })
  depositCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => 'Cohort', 'teams')
  @JoinColumn({ name: 'cohortId' })
  cohort: any;

  @OneToMany(() => 'Submission', 'team')
  submissions: any[];
}
