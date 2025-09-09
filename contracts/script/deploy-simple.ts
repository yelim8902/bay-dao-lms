import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // 1. MockERC20 배포
  console.log("\n1. Deploying MockERC20...");
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Bay Test USD", "bUSD");
  await mockToken.waitForDeployment();
  const tokenAddress = await mockToken.getAddress();
  console.log("MockERC20 deployed to:", tokenAddress);

  // 2. 테스트용 토큰 민팅
  console.log("\n2. Minting test tokens...");
  const mintAmount = ethers.parseEther("1000"); // 1000 bUSD
  await mockToken.mint(deployer.address, mintAmount);
  console.log(`Minted ${ethers.formatEther(mintAmount)} bUSD to deployer`);

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.address);
  console.log("MockERC20 (bUSD):", tokenAddress);
  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
