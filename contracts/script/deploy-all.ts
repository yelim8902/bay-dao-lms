import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Bay LMS 컨트랙트 배포 시작...");

  const [deployer] = await ethers.getSigners();
  console.log("배포자 주소:", deployer.address);
  console.log("배포자 잔액:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 이미 배포된 컨트랙트 주소들
  const MOCK_TOKEN_ADDRESS = "0xf9114ff8CA410e838e6e003A21659B7C849113A9";
  const DEPOSIT_ESCROW_ADDRESS = "0xf8A5d07EFCCa1fe96D7cd5325B4CC70719656150";

  // 1. CohortManager 배포
  console.log("\n📚 CohortManager 배포 중...");
  const CohortManager = await ethers.getContractFactory("CohortManager");
  const cohortManager = await CohortManager.deploy();
  await cohortManager.waitForDeployment();
  const cohortManagerAddress = await cohortManager.getAddress();
  console.log("✅ CohortManager 배포 완료:", cohortManagerAddress);

  // 2. AssignmentRegistry 배포
  console.log("\n📝 AssignmentRegistry 배포 중...");
  const AssignmentRegistry = await ethers.getContractFactory("AssignmentRegistry");
  const assignmentRegistry = await AssignmentRegistry.deploy();
  await assignmentRegistry.waitForDeployment();
  const assignmentRegistryAddress = await assignmentRegistry.getAddress();
  console.log("✅ AssignmentRegistry 배포 완료:", assignmentRegistryAddress);

  // 3. VerifierGateway 배포
  console.log("\n🔍 VerifierGateway 배포 중...");
  const VerifierGateway = await ethers.getContractFactory("VerifierGateway");
  const verifierGateway = await VerifierGateway.deploy();
  await verifierGateway.waitForDeployment();
  const verifierGatewayAddress = await verifierGateway.getAddress();
  console.log("✅ VerifierGateway 배포 완료:", verifierGatewayAddress);

  // 4. BayCertificate 배포
  console.log("\n🏆 BayCertificate 배포 중...");
  const BayCertificate = await ethers.getContractFactory("BayCertificate");
  const bayCertificate = await BayCertificate.deploy();
  await bayCertificate.waitForDeployment();
  const bayCertificateAddress = await bayCertificate.getAddress();
  console.log("✅ BayCertificate 배포 완료:", bayCertificateAddress);

  // 5. 초기 데이터 설정
  console.log("\n⚙️ 초기 데이터 설정 중...");
  
  // CohortManager에 초기 코호트 생성
  const cohortId = ethers.keccak256(ethers.toUtf8Bytes("Bay Research Track 2024"));
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + (6 * 30 * 24 * 60 * 60); // 6개월 후
  
  await cohortManager.createCohort(
    cohortId,
    "Bay Research Track 2024",
    "research",
    ethers.parseEther("100"), // 100 bUSD
    startTime,
    endTime,
    7000 // 70% 통과율
  );
  console.log("✅ 초기 코호트 생성 완료");

  // AssignmentRegistry에 초기 과제 마감일 설정
  await assignmentRegistry.setDeadline(1, startTime + (30 * 24 * 60 * 60)); // 1개월 후
  await assignmentRegistry.setDeadline(2, startTime + (60 * 24 * 60 * 60)); // 2개월 후
  console.log("✅ 초기 과제 마감일 설정 완료");

  // 6. 배포 결과 요약
  console.log("\n🎉 배포 완료!");
  console.log("=" * 50);
  console.log("📋 배포된 컨트랙트 주소들:");
  console.log("MockERC20:", MOCK_TOKEN_ADDRESS);
  console.log("DepositEscrow:", DEPOSIT_ESCROW_ADDRESS);
  console.log("CohortManager:", cohortManagerAddress);
  console.log("AssignmentRegistry:", assignmentRegistryAddress);
  console.log("VerifierGateway:", verifierGatewayAddress);
  console.log("BayCertificate:", bayCertificateAddress);
  console.log("=" * 50);

  // 7. contracts.ts 업데이트용 정보 출력
  console.log("\n📝 apps/web/lib/contracts.ts 업데이트용:");
  console.log(`
export const CONTRACTS = {
  MOCK_TOKEN: '${MOCK_TOKEN_ADDRESS}',
  COHORT_MANAGER: '${cohortManagerAddress}',
  DEPOSIT_ESCROW: '${DEPOSIT_ESCROW_ADDRESS}',
  ASSIGNMENT_REGISTRY: '${assignmentRegistryAddress}',
  VERIFIER_GATEWAY: '${verifierGatewayAddress}',
  BAY_CERTIFICATE: '${bayCertificateAddress}',
} as const;
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 실패:", error);
    process.exit(1);
  });
