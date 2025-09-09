'use client';

import { useState } from 'react';
import { X, Users, Calendar, DollarSign, BookOpen, ArrowRight, Shield, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { DepositModal } from './DepositModal';

interface CohortBrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentAddress: string;
}

export function CohortBrowseModal({ isOpen, onClose, studentAddress }: CohortBrowseModalProps) {
  const { state, dispatch } = useApp();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<string>('');

  // 학생이 이미 참여 중인 기수들
  const enrolledCohortIds = state.enrollments
    .filter(e => e.studentAddress === studentAddress)
    .map(e => e.cohortId);

  // 참여 가능한 기수들 (아직 참여하지 않은 기수)
  const availableCohorts = state.cohorts.filter(cohort => 
    !enrolledCohortIds.includes(cohort.id) && cohort.status === 'active'
  );

  const handleJoinCohort = (cohortId: string) => {
    setSelectedCohort(cohortId);
    setIsDepositModalOpen(true);
  };

  const handleDepositSuccess = () => {
    if (selectedCohort) {
      const cohort = state.cohorts.find(c => c.id === selectedCohort);
      const depositAmount = parseInt(cohort?.depositAmount || '100');
      
      // 학생 등록 정보 생성
      const newEnrollment = {
        studentAddress: studentAddress,
        cohortId: selectedCohort,
        depositAmount: cohort?.depositAmount || '100',
        depositStatus: 'deposited' as const,
        enrolledAt: new Date().toISOString().split('T')[0],
        completedAssignments: [],
        totalScore: 0,
        canRefund: false
      };

      // Context에 등록 정보 추가
      dispatch({ type: 'ENROLL_STUDENT', payload: newEnrollment });
      
      // 총 예치금 업데이트
      dispatch({ 
        type: 'ADD_DEPOSIT', 
        payload: { 
          amount: depositAmount, 
          studentAddress: studentAddress 
        } 
      });
      
      setIsDepositModalOpen(false);
      onClose();
      alert('DAO 트랙 참여가 완료되었습니다!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">DAO 트랙 둘러보기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {availableCohorts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">참여 가능한 DAO 트랙이 없습니다</h3>
            <p className="text-gray-600">새로운 DAO 트랙이 개설되면 알려드리겠습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">DAO 트랙 참여 안내</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    DAO 트랙에 참여하려면 보증금을 예치해야 합니다. 모든 과제를 완료하면 보증금을 100% 돌려받을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableCohorts.map((cohort) => {
                const cohortAssignments = state.assignments.filter(a => a.cohortId === cohort.id);
                const currentParticipants = state.enrollments.filter(e => e.cohortId === cohort.id).length;
                
                return (
                  <div key={cohort.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{cohort.name}</h3>
                        <p className="text-gray-600 mb-3">{cohort.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-blue-600">
                          <span className="px-2 py-1 bg-blue-100 rounded-full">
                            {cohort.track === 'research' ? 'Research' : 'Development'} 트랙
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          모집중
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>참여자: {currentParticipants}/{cohort.maxParticipants}명</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>기간: {cohort.startDate} ~ {cohort.endDate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>보증금: {cohort.depositAmount} bUSD</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>과제: {cohortAssignments.length}개</span>
                      </div>
                    </div>

                    {cohortAssignments.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">과제 목록</h4>
                        <div className="space-y-2">
                          {cohortAssignments.slice(0, 3).map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{assignment.title}</span>
                              <span className="text-gray-500">{assignment.dueDate}</span>
                            </div>
                          ))}
                          {cohortAssignments.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{cohortAssignments.length - 3}개 더...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">요구사항:</p>
                        <p>{cohort.requirements}</p>
                      </div>
                      <button
                        onClick={() => handleJoinCohort(cohort.id)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Shield className="h-4 w-4" />
                        <span>참여하기</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 보증금 예치 모달 */}
        {selectedCohort && (
          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={() => {
              setIsDepositModalOpen(false);
              setSelectedCohort('');
            }}
            cohortId={selectedCohort}
            depositAmount={state.cohorts.find(c => c.id === selectedCohort)?.depositAmount || '100'}
            onSuccess={handleDepositSuccess}
          />
        )}
      </div>
    </div>
  );
}
