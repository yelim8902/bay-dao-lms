'use client';

import { useState } from 'react';
import { Calendar, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AssignmentModal } from './AssignmentModal';
import { useApp } from '../contexts/AppContext';

interface AssignmentCardProps {
  assignmentId: number;
  title: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'submitted' | 'verifying' | 'verified' | 'graded' | 'late';
  score?: number;
  maxScore?: number;
  weight?: number;
  cohortName?: string;
  isAdmin?: boolean;
  onClick?: () => void;
  onSubmit?: () => void;
}

export function AssignmentCard({ 
  assignmentId, 
  title, 
  dueDate, 
  status, 
  score,
  maxScore = 100,
  weight = 20,
  cohortName,
  isAdmin = false,
  onClick,
  onSubmit
}: AssignmentCardProps) {
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const { dispatch } = useApp();

  const handleSubmit = () => {
    // 데모용: 즉시 제출 상태로 변경
    setCurrentStatus('submitted');
    
    // Context에 제출 정보 업데이트
    dispatch({
      type: 'SUBMIT_ASSIGNMENT',
      payload: {
        studentAddress: '0x123...', // 실제로는 현재 사용자 주소
        assignmentId: assignmentId,
        cohortId: '0x1234...' // 실제로는 해당 cohort ID
      }
    });
    
    // 전역 과제 상태도 업데이트 (데모용)
    dispatch({
      type: 'UPDATE_ASSIGNMENT',
      payload: {
        id: assignmentId,
        title: title,
        description: '과제 설명',
        dueDate: '2024-02-22',
        status: 'submitted',
        maxScore: 100,
        weight: 20,
        isRequired: true,
        cohortId: '0x1234...',
        createdAt: new Date().toISOString()
      }
    });
    
    // 부모 컴포넌트의 onSubmit 콜백 호출
    if (onSubmit) {
      onSubmit();
    }
    
    // 모달 닫기
    setIsAssignmentModalOpen(false);
    
    // 성공 메시지
    alert('과제가 성공적으로 제출되었습니다!');
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'verifying':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'graded':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'pending':
        return '미제출';
      case 'in-progress':
        return '진행중';
      case 'submitted':
        return '제출됨';
      case 'verifying':
        return '검증중';
      case 'verified':
        return '검증완료';
      case 'graded':
        return '채점완료';
      case 'late':
        return '지연제출';
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'verifying':
        return 'bg-orange-100 text-orange-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-red-100 text-red-800';
    }
  };

  const isOverdue = new Date(dueDate) < new Date() && currentStatus === 'pending';

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div 
          className={`flex-1 ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <h3 className={`text-lg font-semibold text-gray-900 ${onClick ? 'hover:text-blue-600 transition-colors' : ''}`}>
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>과제 #{assignmentId}</span>
            {cohortName && (
              <>
                <span>•</span>
                <span className="text-blue-600 font-medium">{cohortName}</span>
              </>
            )}
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            마감: {dueDate}
          </span>
        </div>

        {score !== undefined && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">점수:</span>
            <span className={`font-semibold ${
              score >= 80 ? 'text-green-600' : 
              score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score}/{maxScore}점
            </span>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>가중치: {weight}%</span>
            <span>리뷰어: 2명</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        {currentStatus === 'pending' && (
          <button 
            onClick={() => setIsAssignmentModalOpen(true)}
            className="btn-primary flex-1 text-sm"
          >
            과제 제출
          </button>
        )}
        {currentStatus === 'submitted' && (
          <button className="btn-secondary flex-1 text-sm">
            제출 확인
          </button>
        )}
        {currentStatus === 'verifying' && (
          <button className="btn-secondary flex-1 text-sm">
            검증 중...
          </button>
        )}
        {currentStatus === 'verified' && (
          <button className="btn-success flex-1 text-sm">
            검증 완료
          </button>
        )}
        {currentStatus === 'graded' && (
          <button className="btn-secondary flex-1 text-sm">
            결과 보기
          </button>
        )}
        {currentStatus === 'late' && (
          <button 
            onClick={() => setIsAssignmentModalOpen(true)}
            className="btn-secondary flex-1 text-sm"
          >
            지연 제출
          </button>
        )}
      </div>

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        assignmentId={assignmentId}
        title={title}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
