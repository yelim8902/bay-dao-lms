// Bay LMS Shared Package
// 프로젝트 전체에서 사용되는 공통 타입, 컨트랙트 주소, ABI 등을 export

// Contracts
export {
  CONTRACTS,
  EAS_ADDRESS,
  SCHEMA_REGISTRY,
  NETWORK_CONFIG,
} from "./contracts";

// ABIs
export {
  MOCK_TOKEN_ABI,
  DEPOSIT_ESCROW_ABI,
  ASSIGNMENT_REGISTRY_ABI,
  COHORT_MANAGER_ABI,
  BAY_CERTIFICATE_ABI,
} from "./abis";

// Types
export type {
  Assignment,
  Cohort,
  Certificate,
  StudentEnrollment,
  DAOStats,
  ContractStake,
  ContractSubmission,
  ContractCohort,
  ContractTeam,
} from "./types";

// 편의를 위한 컨트랙트 객체들
import { CONTRACTS } from "./contracts";
import {
  MOCK_TOKEN_ABI,
  DEPOSIT_ESCROW_ABI,
  BAY_CERTIFICATE_ABI,
} from "./abis";

export const MOCK_TOKEN_CONTRACT = {
  address: CONTRACTS.MOCK_TOKEN,
  abi: MOCK_TOKEN_ABI,
} as const;

export const DEPOSIT_ESCROW_CONTRACT = {
  address: CONTRACTS.DEPOSIT_ESCROW,
  abi: DEPOSIT_ESCROW_ABI,
} as const;

export const BAY_CERTIFICATE_CONTRACT = {
  address: CONTRACTS.BAY_CERTIFICATE,
  abi: BAY_CERTIFICATE_ABI,
} as const;
