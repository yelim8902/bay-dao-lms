import { IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  student: string;

  @IsString()
  cohortId: string;

  @IsEnum(['sbt', 'eas', 'oa'])
  type: 'sbt' | 'eas' | 'oa';

  @IsOptional()
  @IsNumber()
  tokenId?: number;

  @IsOptional()
  @IsString()
  easUid?: string;

  @IsOptional()
  @IsString()
  oaDocumentId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUri?: string;

  @IsOptional()
  @IsString()
  metadataUri?: string;

  @IsOptional()
  @IsNumber()
  finalScore?: number;

  @IsDateString()
  issuedAt: Date;
}
