'use client';

import { useState } from 'react';
import { Clock, Users, DollarSign, CheckCircle, AlertCircle, Eye, ArrowUpRight } from 'lucide-react';
import { StudentEnrollment } from '../contexts/AppContext';
import { DepositModal } from './DepositModal';

interface CohortCardProps {
  cohortId: string;
  name: string;
  track: 'research' | 'development';
  depositAmount: string;
  status: 'active' | 'completed' | 'upcoming';
  isAdmin?: boolean;
  onClick?: () => void;
  enrollment?: StudentEnrollment;
}

export function CohortCard({ cohortId, name, track, depositAmount, status, isAdmin = false, onClick, enrollment }: CohortCardProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return '진행 중';
      case 'completed':
        return '완료';
      case 'upcoming':
        return '예정';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 capitalize">{track} 트랙</p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span>보증금: {depositAmount} bUSD</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>팀원: 3/5명</span>
        </div>

        {/* 학생 참여 정보 */}
        {enrollment && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">내 진행도</span>
              <span className="text-sm text-blue-700">
                {enrollment.completedAssignments.length}개 완료
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${enrollment.completedAssignments.length > 0 ? 
                    (enrollment.completedAssignments.length / 4) * 100 : 0}%` 
                }}
              ></div>
            </div>
            {enrollment.canRefund && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-green-700 font-medium">보증금 반환 가능!</span>
                <button className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>반환받기</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 font-mono">ID: {cohortId}</p>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        {status === 'active' && (
          <>
            <button 
              onClick={() => setIsDepositModalOpen(true)}
              className="btn-primary flex-1 text-sm"
            >
              보증금 예치
            </button>
            <button className="btn-secondary flex-1 text-sm">
              과제 제출
            </button>
          </>
        )}
        {status === 'completed' && (
          <button className="btn-secondary w-full text-sm">
            인증서 보기
          </button>
        )}
        {status === 'upcoming' && (
          <button className="btn-secondary w-full text-sm" disabled>
            시작 대기 중
          </button>
        )}
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        cohortId={cohortId}
        depositAmount={depositAmount}
      />
    </div>
  );
}
