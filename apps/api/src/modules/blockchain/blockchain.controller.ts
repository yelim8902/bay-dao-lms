import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('deposit')
  async deposit(@Body() body: { cohortId: string; amount: string; userAddress: string }) {
    return await this.blockchainService.deposit(body.cohortId, body.amount, body.userAddress);
  }

  @Post('refund')
  async refund(@Body() body: { cohortId: string; userAddress: string }) {
    return await this.blockchainService.refund(body.cohortId, body.userAddress);
  }

  @Post('slash')
  async slash(@Body() body: { cohortId: string; userAddress: string; bps: number }) {
    return await this.blockchainService.slash(body.cohortId, body.userAddress, body.bps);
  }

  @Post('submit-assignment')
  async submitAssignment(@Body() body: {
    cohortId: string;
    assignmentId: number;
    cidHash: string;
    links: string[];
  }) {
    return await this.blockchainService.submitAssignment(
      body.cohortId,
      body.assignmentId,
      body.cidHash,
      body.links
    );
  }

  @Post('mint-certificate')
  async mintCertificate(@Body() body: {
    to: string;
    tokenId: number;
    uri: string;
    cohortId: string;
  }) {
    return await this.blockchainService.mintCertificate(
      body.to,
      body.tokenId,
      body.uri,
      body.cohortId
    );
  }
}
