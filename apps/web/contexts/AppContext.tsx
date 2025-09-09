'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// 타입 정의
export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'submitted' | 'verifying' | 'verified' | 'graded';
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
  track: 'research' | 'development';
  depositAmount: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  requirements: string;
  status: 'active' | 'completed' | 'upcoming';
  createdAt: string;
}

export interface Certificate {
  id: number;
  name: string;
  cohortId: string;
  issuedAt: string;
  status: 'completed' | 'pending' | 'revoked';
  tokenId: number;
}

export interface StudentEnrollment {
  studentAddress: string;
  cohortId: string;
  depositAmount: string;
  depositStatus: 'not-deposited' | 'deposited' | 'at-risk' | 'completed';
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
  myStatus: 'not-deposited' | 'active' | 'completed' | 'failed';
  canRefund: boolean;
}

// 액션 타입
type AppAction =
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'DELETE_ASSIGNMENT'; payload: number }
  | { type: 'ADD_COHORT'; payload: Cohort }
  | { type: 'UPDATE_COHORT'; payload: Cohort }
  | { type: 'DELETE_COHORT'; payload: string }
  | { type: 'ADD_CERTIFICATE'; payload: Certificate }
  | { type: 'UPDATE_CERTIFICATE'; payload: Certificate }
  | { type: 'ENROLL_STUDENT'; payload: StudentEnrollment }
  | { type: 'UPDATE_ENROLLMENT'; payload: StudentEnrollment }
  | { type: 'SUBMIT_ASSIGNMENT'; payload: { studentAddress: string; assignmentId: number; cohortId: string } }
  | { type: 'UPDATE_DAO_STATS'; payload: DAOStats }
  | { type: 'ADD_DEPOSIT'; payload: { amount: number; studentAddress: string } }
  | { type: 'VERIFY_ASSIGNMENT'; payload: { assignmentId: number } }
  | { type: 'COMPLETE_ASSIGNMENT'; payload: { assignmentId: number } }
  | { type: 'GENERATE_CERTIFICATE'; payload: { studentAddress: string; cohortId: string } };

// 상태 타입
interface AppState {
  assignments: Assignment[];
  cohorts: Cohort[];
  certificates: Certificate[];
  enrollments: StudentEnrollment[];
  daoStats: DAOStats;
}

// 초기 상태
const initialState: AppState = {
  assignments: [
    {
      id: 1,
      title: '이더리움 기초 공부하기',
      description: '이더리움의 기본 개념, 스마트 컨트랙트, 가스비 등에 대해 학습하고 정리하기',
      dueDate: '2024-02-15',
      status: 'pending',
      maxScore: 100,
      weight: 15,
      isRequired: true,
      cohortId: '0x1234...',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      title: 'DAO 거버넌스 이해하기',
      description: 'DAO의 개념, 거버넌스 토큰, 제안 및 투표 시스템에 대해 학습하기',
      dueDate: '2024-02-22',
      status: 'pending',
      maxScore: 100,
      weight: 20,
      isRequired: true,
      cohortId: '0x1234...',
      createdAt: '2024-01-02'
    }
  ],
  cohorts: [
    {
      id: '0x1234...',
      name: 'Bay Research Track 2024',
      description: '블록체인 연구를 위한 심화 과정',
      track: 'research',
      depositAmount: '100',
      maxParticipants: 20,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      requirements: 'React, TypeScript 경험, GitHub 계정',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '0x5678...',
      name: 'Bay Development Track 2024',
      description: '실무 중심의 개발 과정',
      track: 'development',
      depositAmount: '150',
      maxParticipants: 25,
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      requirements: 'JavaScript, Node.js 경험',
      status: 'completed',
      createdAt: '2024-01-15'
    }
  ],
  certificates: [],
  enrollments: [
    {
      studentAddress: '0x1234567890abcdef1234567890abcdef12345678',
      cohortId: '0x1234...',
      depositAmount: '100',
      depositStatus: 'deposited',
      enrolledAt: '2024-01-01',
      completedAssignments: [1],
      totalScore: 92,
      canRefund: false
    }
  ],
  daoStats: {
    totalDeposits: 5000,
    totalParticipants: 25,
    successRate: 85,
    myDeposit: 0,
    myStatus: 'not-deposited',
    canRefund: false
  }
};

// 리듀서
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [...state.assignments, action.payload]
      };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.id ? action.payload : assignment
        )
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(assignment => assignment.id !== action.payload)
      };
    case 'ADD_COHORT':
      return {
        ...state,
        cohorts: [...state.cohorts, action.payload]
      };
    case 'UPDATE_COHORT':
      return {
        ...state,
        cohorts: state.cohorts.map(cohort =>
          cohort.id === action.payload.id ? action.payload : cohort
        )
      };
    case 'DELETE_COHORT':
      return {
        ...state,
        cohorts: state.cohorts.filter(cohort => cohort.id !== action.payload)
      };
    case 'ADD_CERTIFICATE':
      return {
        ...state,
        certificates: [...state.certificates, action.payload]
      };
    case 'UPDATE_CERTIFICATE':
      return {
        ...state,
        certificates: state.certificates.map(certificate =>
          certificate.id === action.payload.id ? action.payload : certificate
        )
      };
    case 'ENROLL_STUDENT':
      return {
        ...state,
        enrollments: [...state.enrollments, action.payload]
      };
    case 'UPDATE_ENROLLMENT':
      return {
        ...state,
        enrollments: state.enrollments.map(enrollment =>
          enrollment.studentAddress === action.payload.studentAddress && 
          enrollment.cohortId === action.payload.cohortId ? action.payload : enrollment
        )
      };
    case 'SUBMIT_ASSIGNMENT':
      const updatedState = {
        ...state,
        enrollments: state.enrollments.map(enrollment => {
          if (enrollment.studentAddress === action.payload.studentAddress && 
              enrollment.cohortId === action.payload.cohortId) {
            const updatedCompletedAssignments = [...enrollment.completedAssignments, action.payload.assignmentId];
            const cohortAssignments = state.assignments.filter(a => a.cohortId === action.payload.cohortId);
            const canRefund = updatedCompletedAssignments.length === cohortAssignments.length;
            
            return {
              ...enrollment,
              completedAssignments: updatedCompletedAssignments,
              canRefund: canRefund,
              depositStatus: canRefund ? 'completed' : enrollment.depositStatus
            };
          }
          return enrollment;
        })
      };

      // 모든 과제가 완료되면 인증서 생성
      const enrollment = updatedState.enrollments.find(e => 
        e.studentAddress === action.payload.studentAddress && 
        e.cohortId === action.payload.cohortId
      );
      
      if (enrollment) {
        const cohortAssignments = state.assignments.filter(a => a.cohortId === action.payload.cohortId);
        const allAssignmentsCompleted = enrollment.completedAssignments.length === cohortAssignments.length;
        
        if (allAssignmentsCompleted) {
          const cohort = state.cohorts.find(c => c.id === action.payload.cohortId);
          const newCertificate: Certificate = {
            id: state.certificates.length + 1,
            name: `${cohort?.name} 수료증`,
            cohortId: action.payload.cohortId,
            issuedAt: new Date().toISOString().split('T')[0],
            status: 'completed',
            tokenId: state.certificates.length + 1
          };
          
          return {
            ...updatedState,
            certificates: [...updatedState.certificates, newCertificate]
          };
        }
      }
      
      return updatedState;
    case 'UPDATE_DAO_STATS':
      return {
        ...state,
        daoStats: action.payload
      };
    case 'ADD_DEPOSIT':
      return {
        ...state,
        daoStats: {
          ...state.daoStats,
          totalDeposits: state.daoStats.totalDeposits + action.payload.amount,
          totalParticipants: state.daoStats.totalParticipants + 1
        }
      };
    case 'VERIFY_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.assignmentId 
            ? { ...assignment, status: 'verifying' as const }
            : assignment
        )
      };
    case 'COMPLETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.assignmentId 
            ? { ...assignment, status: 'verified' as const }
            : assignment
        )
      };
    default:
      return state;
  }
}

// Context 생성
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
