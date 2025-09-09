import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
    return await this.certificateService.createCertificate(createCertificateDto);
  }

  @Get()
  async findAllCertificates() {
    return await this.certificateService.findAllCertificates();
  }

  @Get(':id')
  async findCertificateById(@Param('id') id: string) {
    return await this.certificateService.findCertificateById(id);
  }

  @Get('student/:student')
  async findCertificatesByStudent(@Param('student') student: string) {
    return await this.certificateService.findCertificatesByStudent(student);
  }

  @Get('cohort/:cohortId')
  async findCertificatesByCohort(@Param('cohortId') cohortId: string) {
    return await this.certificateService.findCertificatesByCohort(cohortId);
  }
}
