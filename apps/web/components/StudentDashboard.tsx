'use client';

import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { keccak256, toUtf8Bytes } from 'ethers';
import { CONTRACTS, MOCK_TOKEN_ABI, DEPOSIT_ESCROW_ABI } from '../lib/contracts';
import { useApp } from '../contexts/AppContext';
import { CohortCard } from './CohortCard';
import { AssignmentCard } from './AssignmentCard';
import { CertificateCard } from './CertificateCard';
import { CohortDetailModal } from './CohortDetailModal';
import { AssignmentModal } from './AssignmentModal';
import { CertificateModal } from './CertificateModal';
import { LeaderboardModal } from './LeaderboardModal';
import { DepositModal } from './DepositModal';
import { CohortBrowseModal } from './CohortBrowseModal';
import { Trophy, BookOpen, Award, TrendingUp, Clock, AlertCircle, DollarSign, Users, CheckCircle, ArrowRight, Play, Shield, Target } from 'lucide-react';

interface StudentDashboardProps {
  address: string;
}

export function StudentDashboard({ address }: StudentDashboardProps) {
  const { state, dispatch } = useApp();
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [isCohortDetailOpen, setIsCohortDetailOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isCohortBrowseOpen, setIsCohortBrowseOpen] = useState(false);
  const [submittedAssignments, setSubmittedAssignments] = useState<number[]>([]);
  const [isRefunding, setIsRefunding] = useState(false);

  // 사용자 토큰 잔액 조회 (TokenFaucet과 동일한 설정)
  const { data: tokenBalance, refetch: refetchTokenBalance, error: tokenBalanceError } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 1000, // 1초마다 자동 새로고침 (TokenFaucet과 동일)
      refetchOnWindowFocus: true, // 창 포커스 시 새로고침
      refetchOnMount: true, // 마운트 시 새로고침
    },
  });

  // 보증금 반환을 위한 writeContract
  const { writeContractAsync: refund } = useWriteContract();

  // 학생이 참여 중인 기수들
  const studentEnrollments = state.enrollments.filter(e => e.studentAddress === address);
  const enrolledCohorts = state.cohorts.filter(c => 
    studentEnrollments.some(e => e.cohortId === c.id)
  );
  
  // 학생이 참여 중인 기수의 과제들
  const enrolledCohortIds = studentEnrollments.map(e => e.cohortId);
  const enrolledAssignments = state.assignments.filter(a => 
    enrolledCohortIds.includes(a.cohortId)
  );

  // 학생 통계 데이터 (실제 데이터 기반)
  const studentStats = {
    totalCohorts: enrolledCohorts.length,
    activeCohorts: enrolledCohorts.filter(c => c.status === 'active').length,
    completedAssignments: studentEnrollments.reduce((sum, e) => sum + e.completedAssignments.length, 0),
    totalAssignments: enrolledAssignments.length,
    averageScore: studentEnrollments.length > 0 ? 
      Math.round(studentEnrollments.reduce((sum, e) => sum + e.totalScore, 0) / studentEnrollments.length) : 0,
    certificates: state.certificates.length,
    depositAtRisk: studentEnrollments.some(e => e.depositStatus === 'at-risk'),
    totalDeposits: studentEnrollments.reduce((sum, e) => sum + parseInt(e.depositAmount), 0),
    canRefund: studentEnrollments.some(e => e.canRefund)
  };

  const handleCohortClick = (cohortId: string) => {
    setSelectedCohort(cohortId);
    setIsCohortDetailOpen(true);
  };

  const handleAssignmentSubmitted = (assignmentId: number) => {
    setSubmittedAssignments(prev => [...prev, assignmentId]);
  };

  // 모든 과제가 제출되었는지 확인 (데모용)
  const allAssignmentsCompleted = enrolledAssignments.length > 0 && 
    enrolledAssignments.every(assignment => submittedAssignments.includes(assignment.id));

  // 과제 완료 시 보증금 반환 가능 상태로 업데이트
  React.useEffect(() => {
    if (allAssignmentsCompleted && studentStats.totalDeposits > 0) {
      // 모든 과제가 완료되고 보증금이 있으면 반환 가능 상태로 업데이트
      studentEnrollments.forEach(enrollment => {
        if (!enrollment.canRefund) {
          dispatch({
            type: 'UPDATE_ENROLLMENT',
            payload: {
              ...enrollment,
              canRefund: true
            }
          });
        }
      });
    }
  }, [allAssignmentsCompleted, studentStats.totalDeposits, studentEnrollments, dispatch]);

  const handleRefundDeposit = async () => {
    if (!address) return;
    
    setIsRefunding(true);
    try {
      console.log('Starting refund process...', {
        studentAddress: address,
        totalDeposits: studentStats.totalDeposits
      });
      
      // 실제 DepositEscrow 컨트랙트의 refund 함수 호출
      // 각 기수별로 refund 호출
      for (const enrollment of studentEnrollments) {
        if (enrollment.canRefund) {
          console.log(`Refunding deposit for cohort ${enrollment.cohortId}`);
          
          try {
            // cohortId를 bytes32로 변환 (keccak256 해시 사용)
            const cohortIdBytes32 = keccak256(toUtf8Bytes(enrollment.cohortId)) as `0x${string}`;
            
            console.log('Original cohortId:', enrollment.cohortId);
            console.log('Bytes32 cohortId:', cohortIdBytes32);
            
            const txHash = await refund({
              address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
              abi: DEPOSIT_ESCROW_ABI,
              functionName: 'selfRefund',
              args: [cohortIdBytes32],
            } as any);
            
            console.log(`Refund transaction submitted for cohort ${enrollment.cohortId}:`, txHash);
            
            // 트랜잭션 제출 후 잠시 대기
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (error) {
            console.error(`Refund failed for cohort ${enrollment.cohortId}:`, error);
            throw error;
          }
        }
      }
      
      // 토큰 잔액 새로고침 (반환된 토큰이 지갑에 추가됨)
      refetchTokenBalance();
      
      alert(`🎉 ${studentStats.totalDeposits} bUSD가 지갑으로 반환되었습니다!`);
      
      // Context에서 학생의 canRefund 상태를 false로 변경
      studentEnrollments.forEach(enrollment => {
        dispatch({
          type: 'UPDATE_ENROLLMENT',
          payload: {
            ...enrollment,
            canRefund: false,
            depositStatus: 'completed' as const
          }
        });
      });
    } catch (error) {
      console.error('Refund failed:', error);
      alert(`보증금 반환에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          안녕하세요! 👋
        </h1>
        <p className="text-lg text-gray-600">
          오늘도 열심히 학습해보세요. 현재 <span className="font-semibold text-blue-600">{studentStats.activeCohorts}개</span>의 DAO 트랙에 참여 중입니다.
        </p>
      </div>

      {/* 학습 진행 단계 표시 */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 text-blue-600 mr-2" />
          나의 학습 여정
        </h2>
        
        <div className="flex items-center justify-between">
          {/* 1단계: 기수 참여 */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              enrolledCohorts.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {enrolledCohorts.length > 0 ? <CheckCircle className="h-6 w-6" /> : <Users className="h-6 w-6" />}
            </div>
            <span className="text-sm font-medium text-gray-700">DAO 트랙 참여</span>
            <span className="text-xs text-gray-500">{enrolledCohorts.length}개 참여</span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 2단계: DAO 참여 */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              studentStats.totalDeposits > 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
              {studentStats.totalDeposits > 0 ? <CheckCircle className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
            </div>
            <span className="text-sm font-medium text-gray-700">보증금 예치</span>
            <span className="text-xs text-gray-500">{studentStats.totalDeposits > 0 ? '예치 완료' : '예치 필요'}</span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 3단계: 과제 수행 */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              studentStats.completedAssignments === studentStats.totalAssignments && studentStats.totalAssignments > 0 
                ? 'bg-green-100 text-green-600' 
                : studentStats.completedAssignments > 0 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {studentStats.completedAssignments === studentStats.totalAssignments && studentStats.totalAssignments > 0 ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <BookOpen className="h-6 w-6" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">DAO 과제 수행</span>
            <span className="text-xs text-gray-500">{studentStats.completedAssignments}/{studentStats.totalAssignments} 완료</span>
            {studentStats.totalAssignments > 0 && (
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${(studentStats.completedAssignments / studentStats.totalAssignments) * 100}%` 
                  }}
                ></div>
              </div>
            )}
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 4단계: 보증금 반환 */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              studentStats.canRefund ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {studentStats.canRefund ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
            </div>
            <span className="text-sm font-medium text-gray-700">보증금 반환</span>
            <span className="text-xs text-gray-500">{studentStats.canRefund ? '반환 가능' : '대기 중'}</span>
            {studentStats.canRefund && (
              <button
                onClick={handleRefundDeposit}
                disabled={isRefunding}
                className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                {isRefunding ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>반환 중...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-3 w-3" />
                    <span>반환받기</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 빠른 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 토큰 잔액 카드 */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(2) : '0.00'}
              </p>
              {/* 디버깅용 - 실제 데이터 확인 */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-400">
                  <p>Raw: {tokenBalance?.toString() || 'null'}</p>
                  <p>Address: {address || 'null'}</p>
                  <p>Contract: {CONTRACTS.MOCK_TOKEN}</p>
                  {tokenBalanceError && <p>Error: {tokenBalanceError.message}</p>}
                </div>
              )}
              <p className="text-sm text-gray-600">bUSD 잔액</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{studentStats.completedAssignments}/{studentStats.totalAssignments}</p>
              <p className="text-sm text-gray-600">과제 완료</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{studentStats.averageScore}점</p>
              <p className="text-sm text-gray-600">평균 점수</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{studentStats.certificates}</p>
              <p className="text-sm text-gray-600">획득 인증서</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">15위</p>
              <p className="text-sm text-gray-600">전체 랭킹</p>
            </div>
          </div>
        </div>
      </div>


      {/* 보증금 상태 알림 */}
      {studentStats.depositAtRisk && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">보증금 위험 상태</h3>
              <p className="text-sm text-yellow-700 mt-1">
                과제 마감일을 놓치거나 성적이 기준에 미달할 경우 보증금이 차감될 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 현재 기수 */}
      <section id="cohorts-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            나의 DAO 트랙
          </h2>
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Trophy className="h-4 w-4" />
            <span>랭킹 보기</span>
          </button>
        </div>
        
        {enrolledCohorts.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 참여 중인 DAO 트랙이 없습니다</h3>
            <p className="text-gray-600 mb-4">새로운 DAO 트랙에 참여하여 학습을 시작해보세요!</p>
            <button 
              onClick={() => setIsCohortBrowseOpen(true)}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Play className="h-4 w-4" />
              <span>DAO 트랙 둘러보기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCohorts.map((cohort) => {
              const enrollment = studentEnrollments.find(e => e.cohortId === cohort.id);
              return (
                <CohortCard
                  key={cohort.id}
                  cohortId={cohort.id}
                  name={cohort.name}
                  track={cohort.track}
                  depositAmount={cohort.depositAmount}
                  status={cohort.status}
                  onClick={() => handleCohortClick(cohort.id)}
                  enrollment={enrollment}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* DAO별 과제 */}
      <section id="assignments-section">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          나의 DAO 과제
        </h2>
        
        {enrolledCohorts.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">DAO 과제가 없습니다</h3>
            <p className="text-gray-600">DAO 트랙에 참여하면 과제를 확인할 수 있습니다.</p>
            <button 
              onClick={() => setIsCohortBrowseOpen(true)}
              className="btn-primary flex items-center space-x-2 mx-auto mt-4"
            >
              <Play className="h-4 w-4" />
              <span>DAO 트랙 둘러보기</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {enrolledCohorts.map((cohort) => {
              const cohortAssignments = enrolledAssignments.filter(a => a.cohortId === cohort.id);
              const enrollment = studentEnrollments.find(e => e.cohortId === cohort.id);
              // 데모용: 제출된 과제 수 계산
              const completedCount = cohortAssignments.filter(a => 
                submittedAssignments.includes(a.id)
              ).length;
              const progressPercentage = cohortAssignments.length > 0 ? 
                (completedCount / cohortAssignments.length) * 100 : 0;

              return (
                <div key={cohort.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cohort.name}</h3>
                        <p className="text-sm text-gray-600">{cohort.track} 트랙</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{completedCount}/{cohortAssignments.length} 제출</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {cohortAssignments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>아직 과제가 없습니다.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cohortAssignments.map((assignment) => {
                        // 데모용: 제출된 과제인지 확인
                        const isSubmitted = submittedAssignments.includes(assignment.id);
                        return (
                          <AssignmentCard
                            key={assignment.id}
                            assignmentId={assignment.id}
                            title={assignment.title}
                            dueDate={assignment.dueDate}
                            status={isSubmitted ? 'submitted' : assignment.status}
                            score={assignment.score}
                            maxScore={assignment.maxScore}
                            weight={assignment.weight}
                            cohortName={cohort.name}
                            onClick={() => setIsAssignmentModalOpen(true)}
                            onSubmit={() => {
                              // 과제 제출 처리
                              handleAssignmentSubmitted(assignment.id);
                              
                              // Context에 과제 제출 정보 업데이트
                              dispatch({
                                type: 'SUBMIT_ASSIGNMENT',
                                payload: {
                                  studentAddress: address,
                                  assignmentId: assignment.id,
                                  cohortId: cohort.id
                                }
                              });
                              
                              console.log('Assignment submitted:', assignment.id);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 내 인증서 */}
      <section id="certificates-section">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="h-6 w-6 text-purple-600 mr-2" />
          나의 인증서
        </h2>
        
        {state.certificates.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 획득한 인증서가 없습니다</h3>
            <p className="text-gray-600">과제를 완료하고 기수를 수료하면 인증서를 받을 수 있습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                tokenId={certificate.tokenId}
                name={certificate.name}
                cohortId={certificate.cohortId}
                issuedAt={certificate.issuedAt}
                status={certificate.status}
                onClick={() => setIsCertificateModalOpen(true)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 랭킹 섹션 */}
      <section id="leaderboard-section">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="h-6 w-6 text-yellow-600 mr-2" />
          랭킹
        </h2>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">전체 랭킹</h3>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>상세 보기</span>
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Alice</p>
                  <p className="text-sm text-gray-600">Bay Research Track</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">98점</p>
                <p className="text-sm text-gray-600">5개 과제 완료</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bob</p>
                  <p className="text-sm text-gray-600">Bay Development Track</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">95점</p>
                <p className="text-sm text-gray-600">4개 과제 완료</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  15
                </div>
                <div>
                  <p className="font-medium text-gray-900">나</p>
                  <p className="text-sm text-gray-600">Bay Research Track</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{studentStats.averageScore}점</p>
                <p className="text-sm text-gray-600">{studentStats.completedAssignments}개 과제 완료</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모달들 */}
      {selectedCohort && (
        <CohortDetailModal
          isOpen={isCohortDetailOpen}
          onClose={() => {
            setIsCohortDetailOpen(false);
            setSelectedCohort(null);
          }}
          cohortId={selectedCohort}
          name="Bay Research Track 2024"
          track="research"
          depositAmount="100"
          status="active"
        />
      )}

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        assignmentId={1}
        title="이더리움 기초 공부하기"
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        tokenId={1}
        name="Bay Research Track 수료증"
        cohortId="0x1234..."
        issuedAt="2024-01-30"
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        cohortId="0x1234..."
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        cohortId="0x1234..."
        depositAmount="100"
        onSuccess={() => {
          // 토큰 잔액 새로고침
          refetchTokenBalance();
          // 메시지는 DepositModal에서 이미 표시됨
        }}
      />

      <CohortBrowseModal
        isOpen={isCohortBrowseOpen}
        onClose={() => setIsCohortBrowseOpen(false)}
        studentAddress={address}
      />
    </div>
  );
}
