import { ethers } from "hardhat";

const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const SCHEMA_REGISTRY = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("EAS registration script - account:", signer.address);

  console.log("\n=== EAS ADDRESSES (Sepolia) ===");
  console.log("EAS Contract:", EAS_ADDRESS);
  console.log("Schema Registry:", SCHEMA_REGISTRY);
  console.log("\n✅ EAS addresses configured!");
  console.log("\nTo register schemas manually, visit: https://sepolia.easscan.org/");
  console.log("\nExample schemas to register:");
  console.log("1. AssignmentReview: bytes32 cohortId,uint256 assignmentId,address student,uint8 score,bool pass,string comment,string evidenceCID");
  console.log("2. CohortCompletion: bytes32 cohortId,address student,uint8 finalScore,bool completed,string track,uint256 completedAt,string certificateURI");
  console.log("3. PlagiarismFlag: bytes32 cohortId,uint256 assignmentId,address student,uint8 similarity,string tool,string evidence,uint256 flaggedAt");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
