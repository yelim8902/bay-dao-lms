import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Mock ERC20 토큰 배포 (테스트 보증금용)
  console.log("\n1. Deploying Mock ERC20...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Bay Test USD", "bUSD");
  await mockToken.waitForDeployment();
  const tokenAddress = await mockToken.getAddress();
  console.log("Mock ERC20 deployed to:", tokenAddress);

  // 2. CohortManager 배포
  console.log("\n2. Deploying CohortManager...");
  const CohortManager = await ethers.getContractFactory("CohortManager");
  const cohortManager = await CohortManager.deploy();
  await cohortManager.waitForDeployment();
  const cohortManagerAddress = await cohortManager.getAddress();
  console.log("CohortManager deployed to:", cohortManagerAddress);

  // 3. DepositEscrow 배포
  console.log("\n3. Deploying DepositEscrow...");
  const DepositEscrow = await ethers.getContractFactory("DepositEscrow");
  const depositEscrow = await DepositEscrow.deploy(
    tokenAddress,
    deployer.address, // verifier
    deployer.address  // treasury
  );
  await depositEscrow.waitForDeployment();
  const depositEscrowAddress = await depositEscrow.getAddress();
  console.log("DepositEscrow deployed to:", depositEscrowAddress);

  // 4. AssignmentRegistry 배포
  console.log("\n4. Deploying AssignmentRegistry...");
  const AssignmentRegistry = await ethers.getContractFactory("AssignmentRegistry");
  const assignmentRegistry = await AssignmentRegistry.deploy();
  await assignmentRegistry.waitForDeployment();
  const assignmentRegistryAddress = await assignmentRegistry.getAddress();
  console.log("AssignmentRegistry deployed to:", assignmentRegistryAddress);

  // 5. VerifierGateway 배포 (EAS 주소는 나중에 설정)
  console.log("\n5. Deploying VerifierGateway...");
  const VerifierGateway = await ethers.getContractFactory("VerifierGateway");
  const verifierGateway = await VerifierGateway.deploy(
    "0xC2679fBD37d54388Ce493F1DB75320D236e1815e", // EAS Sepolia
    depositEscrowAddress,
    assignmentRegistryAddress,
    cohortManagerAddress
  );
  await verifierGateway.waitForDeployment();
  const verifierGatewayAddress = await verifierGateway.getAddress();
  console.log("VerifierGateway deployed to:", verifierGatewayAddress);

  // 6. SimpleSBT 배포
  console.log("\n6. Deploying SimpleSBT...");
  const SimpleSBT = await ethers.getContractFactory("SimpleSBT");
  const simpleSBT = await SimpleSBT.deploy("Bay Certificate", "BAYCERT", verifierGatewayAddress);
  await simpleSBT.waitForDeployment();
  const simpleSBTAddress = await simpleSBT.getAddress();
  console.log("SimpleSBT deployed to:", simpleSBTAddress);

  // 7. 테스트용 토큰 민팅
  console.log("\n7. Minting test tokens...");
  const mintAmount = ethers.parseEther("1000"); // 1000 bUSD
  await mockToken.mint(deployer.address, mintAmount);
  console.log(`Minted ${ethers.formatEther(mintAmount)} bUSD to deployer`);

  // 8. 배포 결과 요약
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("Mock ERC20 (bUSD):", tokenAddress);
  console.log("CohortManager:", cohortManagerAddress);
  console.log("DepositEscrow:", depositEscrowAddress);
  console.log("AssignmentRegistry:", assignmentRegistryAddress);
  console.log("VerifierGateway:", verifierGatewayAddress);
  console.log("SimpleSBT:", simpleSBTAddress);

  // 9. 환경변수 파일 생성
  const envContent = `# Bay LMS Contract Addresses (Sepolia)
MOCK_TOKEN_ADDRESS=${tokenAddress}
COHORT_MANAGER_ADDRESS=${cohortManagerAddress}
DEPOSIT_ESCROW_ADDRESS=${depositEscrowAddress}
ASSIGNMENT_REGISTRY_ADDRESS=${assignmentRegistryAddress}
VERIFIER_GATEWAY_ADDRESS=${verifierGatewayAddress}
SIMPLE_SBT_ADDRESS=${simpleSBTAddress}

# EAS Sepolia Addresses
EAS_ADDRESS=0xC2679fBD37d54388Ce493F1DB75320D236e1815e
SCHEMA_REGISTRY_ADDRESS=0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0
`;

  const fs = require('fs');
  fs.writeFileSync('.env.contracts', envContent);
  console.log("\nContract addresses saved to .env.contracts");

  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
