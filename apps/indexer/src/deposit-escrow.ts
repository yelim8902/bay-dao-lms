import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Deposit, Refund, Slash } from "../generated/DepositEscrow/DepositEscrow";
import { Deposit as DepositEntity, Refund as RefundEntity, Slash as SlashEntity, Stake } from "../generated/schema";

export function handleDeposit(event: Deposit): void {
  let deposit = new DepositEntity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  
  deposit.cohortId = event.params.cohortId;
  deposit.user = event.params.user;
  deposit.amount = event.params.amount;
  deposit.txHash = event.transaction.hash;
  deposit.blockNumber = event.block.number;
  deposit.timestamp = event.block.timestamp;
  
  deposit.save();

  // Update or create stake
  let stakeId = event.params.cohortId.toHex() + "-" + event.params.user.toHex();
  let stake = Stake.load(stakeId);
  
  if (stake == null) {
    stake = new Stake(stakeId);
    stake.cohortId = event.params.cohortId;
    stake.user = event.params.user;
    stake.createdAt = event.block.timestamp;
  }
  
  stake.amount = event.params.amount;
  stake.settled = false;
  stake.save();
}

export function handleRefund(event: Refund): void {
  let refund = new RefundEntity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  
  refund.cohortId = event.params.cohortId;
  refund.user = event.params.user;
  refund.amount = event.params.amount;
  refund.txHash = event.transaction.hash;
  refund.blockNumber = event.block.number;
  refund.timestamp = event.block.timestamp;
  
  refund.save();

  // Update stake
  let stakeId = event.params.cohortId.toHex() + "-" + event.params.user.toHex();
  let stake = Stake.load(stakeId);
  
  if (stake != null) {
    stake.settled = true;
    stake.save();
  }
}

export function handleSlash(event: Slash): void {
  let slash = new SlashEntity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  
  slash.cohortId = event.params.cohortId;
  slash.user = event.params.user;
  slash.amount = event.params.amount;
  slash.slashAmount = event.params.slashAmount;
  slash.txHash = event.transaction.hash;
  slash.blockNumber = event.block.number;
  slash.timestamp = event.block.timestamp;
  
  slash.save();

  // Update stake
  let stakeId = event.params.cohortId.toHex() + "-" + event.params.user.toHex();
  let stake = Stake.load(stakeId);
  
  if (stake != null) {
    stake.settled = true;
    stake.save();
  }
}
