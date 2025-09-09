// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MockERC20.sol";
import "../src/CohortManager.sol";
import "../src/DepositEscrow.sol";
import "../src/AssignmentRegistry.sol";
import "../src/VerifierGateway.sol";
import "../src/SimpleSBT.sol";

contract DeployTest is Test {
    function testDeploy() public {
        // 1. Mock ERC20 배포
        MockERC20 mockToken = new MockERC20("Bay Test USD", "bUSD");
        console.log("MockERC20 deployed to:", address(mockToken));

        // 2. CohortManager 배포
        CohortManager cohortManager = new CohortManager();
        console.log("CohortManager deployed to:", address(cohortManager));

        // 3. DepositEscrow 배포
        DepositEscrow depositEscrow = new DepositEscrow(
            IERC20(address(mockToken)),
            address(this), // verifier
            address(this) // treasury
        );
        console.log("DepositEscrow deployed to:", address(depositEscrow));

        // 4. AssignmentRegistry 배포
        AssignmentRegistry assignmentRegistry = new AssignmentRegistry();
        console.log(
            "AssignmentRegistry deployed to:",
            address(assignmentRegistry)
        );

        // 5. VerifierGateway 배포
        VerifierGateway verifierGateway = new VerifierGateway(
            address(0), // EAS (mock)
            address(depositEscrow),
            address(assignmentRegistry),
            address(cohortManager)
        );
        console.log("VerifierGateway deployed to:", address(verifierGateway));

        // 6. SimpleSBT 배포
        SimpleSBT simpleSBT = new SimpleSBT(
            "Bay Certificate",
            "BAYCERT",
            address(verifierGateway)
        );
        console.log("SimpleSBT deployed to:", address(simpleSBT));

        // 7. 테스트 토큰 민팅
        mockToken.mint(address(this), 1000 * 10 ** 18);
        console.log("Minted 1000 tokens to deployer");

        console.log("\n=== DEPLOYMENT SUCCESS ===");
        console.log("All contracts deployed successfully!");
    }
}
