import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  student: string; // wallet address

  @Column()
  cohortId: string;

  @Column({ type: 'enum', enum: ['sbt', 'eas', 'oa'] })
  type: 'sbt' | 'eas' | 'oa'; // SBT, EAS, OpenAttestation

  @Column({ nullable: true })
  tokenId: number; // SBT token ID

  @Column({ nullable: true })
  easUid: string; // EAS attestation UID

  @Column({ nullable: true })
  oaDocumentId: string; // OpenAttestation document ID

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUri: string;

  @Column({ type: 'text', nullable: true })
  metadataUri: string;

  @Column({ type: 'int', nullable: true })
  finalScore: number;

  @Column({ type: 'enum', enum: ['pending', 'issued', 'revoked'], default: 'pending' })
  status: 'pending' | 'issued' | 'revoked';

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
