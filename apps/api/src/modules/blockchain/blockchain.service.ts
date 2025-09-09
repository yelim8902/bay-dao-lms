import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  // Contract addresses
  private readonly contracts = {
    mockToken: process.env.MOCK_TOKEN_ADDRESS,
    cohortManager: process.env.COHORT_MANAGER_ADDRESS,
    depositEscrow: process.env.DEPOSIT_ESCROW_ADDRESS,
    assignmentRegistry: process.env.ASSIGNMENT_REGISTRY_ADDRESS,
    verifierGateway: process.env.VERIFIER_GATEWAY_ADDRESS,
    bayCertificate: process.env.BAY_CERTIFICATE_ADDRESS,
  };

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get('SEPOLIA_RPC_URL');
    const privateKey = this.configService.get('DEPLOYER_PRIVATE_KEY');
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  // Deposit Escrow functions
  async deposit(cohortId: string, amount: string, userAddress: string) {
    try {
      // First approve tokens
      await this.approveTokens(userAddress, amount);
      
      // Then deposit
      const contract = new ethers.Contract(
        this.contracts.depositEscrow,
        this.getDepositEscrowABI(),
        this.wallet
      );

      const tx = await contract.deposit(cohortId, ethers.parseEther(amount));
      await tx.wait();
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      this.logger.error('Deposit failed:', error);
      throw error;
    }
  }

  async refund(cohortId: string, userAddress: string) {
    try {
      const contract = new ethers.Contract(
        this.contracts.depositEscrow,
        this.getDepositEscrowABI(),
        this.wallet
      );

      const tx = await contract.refund(cohortId, userAddress);
      await tx.wait();
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      this.logger.error('Refund failed:', error);
      throw error;
    }
  }

  async slash(cohortId: string, userAddress: string, bps: number) {
    try {
      const contract = new ethers.Contract(
        this.contracts.depositEscrow,
        this.getDepositEscrowABI(),
        this.wallet
      );

      const tx = await contract.slash(cohortId, userAddress, bps);
      await tx.wait();
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      this.logger.error('Slash failed:', error);
      throw error;
    }
  }

  // Assignment Registry functions
  async submitAssignment(
    cohortId: string,
    assignmentId: number,
    cidHash: string,
    links: string[]
  ) {
    try {
      const contract = new ethers.Contract(
        this.contracts.assignmentRegistry,
        this.getAssignmentRegistryABI(),
        this.wallet
      );

      const tx = await contract.submit(cohortId, assignmentId, cidHash, links);
      await tx.wait();
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      this.logger.error('Assignment submission failed:', error);
      throw error;
    }
  }

  // Certificate functions
  async mintCertificate(
    to: string,
    tokenId: number,
    uri: string,
    cohortId: string
  ) {
    try {
      const contract = new ethers.Contract(
        this.contracts.bayCertificate,
        this.getBayCertificateABI(),
        this.wallet
      );

      const tx = await contract.mint(to, tokenId, uri, cohortId);
      await tx.wait();
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      this.logger.error('Certificate minting failed:', error);
      throw error;
    }
  }

  // Helper functions
  private async approveTokens(userAddress: string, amount: string) {
    const contract = new ethers.Contract(
      this.contracts.mockToken,
      this.getMockTokenABI(),
      this.wallet
    );

    const tx = await contract.approve(
      this.contracts.depositEscrow,
      ethers.parseEther(amount)
    );
    await tx.wait();
  }

  private getMockTokenABI() {
    return [
      'function approve(address spender, uint256 amount) returns (bool)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function balanceOf(address owner) view returns (uint256)',
    ];
  }

  private getDepositEscrowABI() {
    return [
      'function deposit(bytes32 cohortId, uint256 amount)',
      'function refund(bytes32 cohortId, address user)',
      'function slash(bytes32 cohortId, address user, uint256 bps)',
      'function getStake(bytes32 cohortId, address user) view returns (uint256 amount, bool settled)',
    ];
  }

  private getAssignmentRegistryABI() {
    return [
      'function submit(bytes32 cohortId, uint256 assignmentId, bytes32 cidHash, string[] calldata links)',
      'function getSubmission(bytes32 cohortId, uint256 assignmentId, address student) view returns (tuple(bytes32 cidHash, uint40 submittedAt, string[] links, bool isLate))',
    ];
  }

  private getBayCertificateABI() {
    return [
      'function mint(address to, uint256 tokenId, string memory uri, bytes32 cohortId)',
      'function tokenURI(uint256 tokenId) view returns (string)',
      'function ownerOf(uint256 tokenId) view returns (address)',
    ];
  }
}
