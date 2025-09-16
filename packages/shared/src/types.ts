// 공통 타입 정의

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status:
    | "pending"
    | "in-progress"
    | "submitted"
    | "verifying"
    | "verified"
    | "graded";
  score?: number;
  maxScore: number;
  weight: number;
  isRequired: boolean;
  cohortId: string;
  createdAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  track: "research" | "development";
  depositAmount: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  requirements: string;
  status: "active" | "completed" | "upcoming";
  createdAt: string;
}

export interface Certificate {
  id: number;
  name: string;
  cohortId: string;
  issuedAt: string;
  status: "completed" | "pending" | "revoked";
  tokenId: number;
}

export interface StudentEnrollment {
  studentAddress: string;
  cohortId: string;
  depositAmount: string;
  depositStatus: "not-deposited" | "deposited" | "at-risk" | "completed";
  enrolledAt: string;
  completedAssignments: number[];
  totalScore: number;
  canRefund: boolean;
}

export interface DAOStats {
  totalDeposits: number;
  totalParticipants: number;
  successRate: number;
  myDeposit: number;
  myStatus: "not-deposited" | "active" | "completed" | "failed";
  canRefund: boolean;
}

// 컨트랙트 관련 타입
export interface ContractStake {
  amount: bigint;
  settled: boolean;
}

export interface ContractSubmission {
  cidHash: string;
  submittedAt: number;
  links: string[];
  isLate: boolean;
}

export interface ContractCohort {
  id: string;
  name: string;
  track: string;
  depositAmount: bigint;
  startAt: bigint;
  endAt: bigint;
  minPassRate: bigint;
  isActive: boolean;
}

export interface ContractTeam {
  id: string;
  cohortId: string;
  name: string;
  leader: string;
  members: string[];
  depositCompleted: boolean;
}
