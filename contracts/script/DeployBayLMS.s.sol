// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {CohortManager} from "../src/CohortManager.sol";
import {DepositEscrow} from "../src/DepositEscrow.sol";

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);
}

contract DeployBayLMS is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Mock ERC20 토큰 배포 (테스트 보증금용)
        console.log("\n1. Deploying Mock ERC20...");
        MockERC20 mockToken = new MockERC20("Bay Test USD", "bUSD");
        console.log("Mock ERC20 deployed to:", address(mockToken));

        // 2. CohortManager 배포
        console.log("\n2. Deploying CohortManager...");
        CohortManager cohortManager = new CohortManager();
        console.log("CohortManager deployed to:", address(cohortManager));

        // 3. DepositEscrow 배포
        console.log("\n3. Deploying DepositEscrow...");
        DepositEscrow depositEscrow = new DepositEscrow(
            mockToken,
            deployer, // verifier
            deployer // treasury
        );
        console.log("DepositEscrow deployed to:", address(depositEscrow));

        // 4. 테스트용 토큰 민팅
        console.log("\n4. Minting test tokens...");
        uint256 mintAmount = 1000 * 10 ** 18; // 1000 bUSD
        mockToken.mint(deployer, mintAmount);
        console.log("Minted 1000 bUSD to deployer");

        vm.stopBroadcast();

        // 5. 배포 결과 요약
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Sepolia");
        console.log("Deployer:", deployer);
        console.log("\nContract Addresses:");
        console.log("Mock ERC20 (bUSD):", address(mockToken));
        console.log("CohortManager:", address(cohortManager));
        console.log("DepositEscrow:", address(depositEscrow));

        console.log("\nDeployment completed successfully!");
    }
}
