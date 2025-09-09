import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { CertificateMinted } from "../generated/BayCertificate/BayCertificate";
import { Certificate } from "../generated/schema";

export function handleCertificateMinted(event: CertificateMinted): void {
  let certificate = new Certificate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  
  certificate.student = event.params.to;
  certificate.cohortId = event.params.cohortId;
  certificate.tokenId = event.params.tokenId;
  certificate.name = "Bay Certificate #" + event.params.tokenId.toString();
  certificate.description = "Bay LMS Completion Certificate";
  certificate.imageUri = event.params.uri;
  certificate.metadataUri = event.params.uri;
  certificate.status = "issued";
  certificate.issuedAt = event.block.timestamp;
  certificate.createdAt = event.block.timestamp;
  
  certificate.save();
}
