import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  async createCertificate(createCertificateDto: CreateCertificateDto): Promise<Certificate> {
    const certificate = this.certificateRepository.create(createCertificateDto);
    return await this.certificateRepository.save(certificate);
  }

  async findAllCertificates(): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findCertificateById(id: string): Promise<Certificate> {
    return await this.certificateRepository.findOne({
      where: { id },
    });
  }

  async findCertificatesByStudent(student: string): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { student },
      order: { issuedAt: 'DESC' },
    });
  }

  async findCertificatesByCohort(cohortId: string): Promise<Certificate[]> {
    return await this.certificateRepository.find({
      where: { cohortId },
      order: { issuedAt: 'DESC' },
    });
  }
}
