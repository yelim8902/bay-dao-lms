import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DepositEscrow contract...");

  // MockERC20 토큰 주소 (이미 배포된 것)
  const MOCK_TOKEN_ADDRESS = "0xf9114ff8CA410e838e6e003A21659B7C849113A9";
  
  // 검증자 주소 (임시로 배포자 주소 사용)
  const [deployer] = await ethers.getSigners();
  const VERIFIER_ADDRESS = deployer.address;
  
  // 트레저리 주소 (임시로 배포자 주소 사용)
  const TREASURY_ADDRESS = deployer.address;

  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // DepositEscrow 컨트랙트 배포
  const DepositEscrow = await ethers.getContractFactory("DepositEscrow");
  const depositEscrow = await DepositEscrow.deploy(
    MOCK_TOKEN_ADDRESS,
    VERIFIER_ADDRESS,
    TREASURY_ADDRESS
  );

  await depositEscrow.waitForDeployment();

  const depositEscrowAddress = await depositEscrow.getAddress();
  
  console.log("DepositEscrow deployed to:", depositEscrowAddress);
  console.log("Constructor parameters:");
  console.log("- Token:", MOCK_TOKEN_ADDRESS);
  console.log("- Verifier:", VERIFIER_ADDRESS);
  console.log("- Treasury:", TREASURY_ADDRESS);
  
  // 컨트랙트 주소를 contracts.ts에 업데이트하라고 안내
  console.log("\n=== IMPORTANT ===");
  console.log("Please update the DEPOSIT_ESCROW address in apps/web/lib/contracts.ts:");
  console.log(`DEPOSIT_ESCROW: '${depositEscrowAddress}',`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
