import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { AssignmentSubmitted } from "../generated/AssignmentRegistry/AssignmentRegistry";
import { Submission } from "../generated/schema";

export function handleAssignmentSubmitted(event: AssignmentSubmitted): void {
  let submission = new Submission(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  
  submission.assignmentId = event.params.assignmentId;
  submission.student = event.params.student;
  submission.cidHash = event.params.cidHash;
  submission.links = event.params.links;
  submission.submittedAt = event.block.timestamp;
  submission.isLate = false; // Will be updated by off-chain logic
  submission.status = "submitted";
  submission.passed = false;
  submission.createdAt = event.block.timestamp;
  
  // Set teamId (will be updated by off-chain logic)
  submission.teamId = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000000");
  
  submission.save();
}
