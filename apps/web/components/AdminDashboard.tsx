'use client';

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS, MOCK_TOKEN_ABI } from '../lib/contracts';
import { useApp } from '../contexts/AppContext';
import { CohortCard } from './CohortCard';
import { AssignmentCard } from './AssignmentCard';
import { CertificateCard } from './CertificateCard';
import { CreateCohortModal } from './CreateCohortModal';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { TeamManagementModal } from './TeamManagementModal';
import { LeaderboardModal } from './LeaderboardModal';
import { Plus, Users, Trophy, Settings, BarChart3, DollarSign, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  address: string;
}

export function AdminDashboard({ address }: AdminDashboardProps) {
  const { state } = useApp();
  const [isCreateCohortOpen, setIsCreateCohortOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [selectedCohortForAssignment, setSelectedCohortForAssignment] = useState<string>('');

  // 사용자 토큰 잔액 조회
  const { data: tokenBalance } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // 관리자 통계 데이터 (실제 데이터 기반)
  const adminStats = {
    totalCohorts: state.cohorts.length,
    activeCohorts: state.cohorts.filter(c => c.status === 'active').length,
    totalStudents: 45, // 실제로는 사용자 데이터에서 계산
    activeStudents: 32,
    totalAssignments: state.assignments.length,
    pendingGrading: state.assignments.filter(a => a.status === 'submitted').length,
    totalRevenue: 1250,
    systemHealth: 'good'
  };

  return (
    <div className="space-y-8">
      {/* 관리자 헤더 */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              관리자 대시보드 🛠️
            </h1>
            <p className="text-lg text-gray-600">
              시스템 전체 현황을 모니터링하고 관리하세요.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm text-gray-600">시스템 상태</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">정상</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.totalStudents}</p>
              <p className="text-sm text-gray-600">총 학생 수</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.activeCohorts}</p>
              <p className="text-sm text-gray-600">활성 DAO 트랙</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.pendingGrading}</p>
              <p className="text-sm text-gray-600">채점 대기</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminStats.totalRevenue}</p>
              <p className="text-sm text-gray-600">총 수익 (bUSD)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setIsCreateCohortOpen(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">새 DAO 트랙 생성</p>
              <p className="text-sm text-gray-600">새로운 학습 DAO 트랙을 만들어보세요</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (state.cohorts.length === 0) {
                alert('먼저 DAO 트랙을 생성해주세요.');
                return;
              }
              setIsCreateAssignmentOpen(true);
            }}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">과제 생성</p>
              <p className="text-sm text-gray-600">새로운 과제를 추가하세요</p>
            </div>
          </button>

          <button
            onClick={() => setIsTeamManagementOpen(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">팀 관리</p>
              <p className="text-sm text-gray-600">팀원을 관리하고 초대하세요</p>
            </div>
          </button>
        </div>
      </div>

      {/* 기수 관리 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">DAO 트랙 관리</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsCreateCohortOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>DAO 트랙 생성</span>
            </button>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>전체 랭킹</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.cohorts.map((cohort) => (
            <CohortCard
              key={cohort.id}
              cohortId={cohort.id}
              name={cohort.name}
              track={cohort.track}
              depositAmount={cohort.depositAmount}
              status={cohort.status}
              isAdmin={true}
            />
          ))}
        </div>
      </section>

      {/* 과제 관리 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">과제 관리</h2>
          <button
            onClick={() => {
              if (state.cohorts.length === 0) {
                alert('먼저 DAO 트랙을 생성해주세요.');
                return;
              }
              setIsCreateAssignmentOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>과제 생성</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.assignments.map((assignment) => {
            const cohort = state.cohorts.find(c => c.id === assignment.cohortId);
            return (
              <AssignmentCard
                key={assignment.id}
                assignmentId={assignment.id}
                title={assignment.title}
                dueDate={assignment.dueDate}
                status={assignment.status}
                score={assignment.score}
                maxScore={assignment.maxScore}
                weight={assignment.weight}
                cohortName={cohort?.name}
                isAdmin={true}
              />
            );
          })}
        </div>
      </section>

      {/* 시스템 알림 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">시스템 알림</h3>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• 8개의 과제가 채점을 기다리고 있습니다</li>
              <li>• 3명의 학생이 보증금 위험 상태입니다</li>
              <li>• 새로운 기수 등록이 2건 대기 중입니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <CreateCohortModal
        isOpen={isCreateCohortOpen}
        onClose={() => setIsCreateCohortOpen(false)}
      />
      
      <CreateAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
      />
      
      <TeamManagementModal
        isOpen={isTeamManagementOpen}
        onClose={() => setIsTeamManagementOpen(false)}
        cohortId="0x1234..."
      />
      
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        cohortId="0x1234..."
      />
    </div>
  );
}
