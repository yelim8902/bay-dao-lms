'use client';

import { useState } from 'react';
import { X, DollarSign, Users, Calendar, BookOpen, Trophy, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface StudySession {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
  maxParticipants: number;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  weight: number;
  isRequired: boolean;
}

interface CohortDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId: string;
  name: string;
  track: string;
  depositAmount: string;
  status: string;
}

export function CohortDetailModal({ 
  isOpen, 
  onClose, 
  cohortId, 
  name, 
  track, 
  depositAmount, 
  status 
}: CohortDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'sessions' | 'treasury'>('overview');
  const [userDepositStatus, setUserDepositStatus] = useState<'not-deposited' | 'deposited' | 'at-risk' | 'completed'>('deposited');
  const [userProgress, setUserProgress] = useState({
    completedAssignments: 3,
    totalAssignments: 8,
    currentScore: 85,
    depositAtRisk: false
  });

  const mockAssignments: Assignment[] = [
    {
      id: 1,
      title: '이더리움 기초 공부하기',
      description: '이더리움의 기본 개념, 스마트 컨트랙트, 가스비 등에 대해 학습하고 정리하기',
      dueDate: '2024-02-15',
      status: 'completed',
      score: 92,
      maxScore: 100,
      weight: 15,
      isRequired: true
    },
    {
      id: 2,
      title: 'DAO 거버넌스 이해하기',
      description: 'DAO의 개념, 거버넌스 토큰, 제안 및 투표 시스템에 대해 학습하기',
      dueDate: '2024-02-22',
      status: 'in-progress',
      maxScore: 100,
      weight: 20,
      isRequired: true
    },
    {
      id: 3,
      title: '스마트 컨트랙트 실습',
      description: 'Solidity를 사용하여 간단한 스마트 컨트랙트 작성 및 배포하기',
      dueDate: '2024-03-01',
      status: 'pending',
      maxScore: 100,
      weight: 25,
      isRequired: true
    },
    {
      id: 4,
      title: 'DeFi 프로토콜 분석',
      description: '주요 DeFi 프로토콜들의 작동 원리와 토큰 이코노미 분석하기',
      dueDate: '2024-03-08',
      status: 'pending',
      maxScore: 100,
      weight: 20,
      isRequired: false
    }
  ];

  const mockSessions: StudySession[] = [
    {
      id: '1',
      title: '이더리움 기초 스터디',
      date: '2024-02-10',
      status: 'completed',
      participants: 12,
      maxParticipants: 15
    },
    {
      id: '2',
      title: 'DAO 거버넌스 워크샵',
      date: '2024-02-17',
      status: 'active',
      participants: 8,
      maxParticipants: 15
    },
    {
      id: '3',
      title: '스마트 컨트랙트 해커톤',
      date: '2024-02-24',
      status: 'upcoming',
      participants: 0,
      maxParticipants: 15
    }
  ];

  const getDepositStatusColor = () => {
    switch (userDepositStatus) {
      case 'not-deposited':
        return 'bg-red-100 text-red-800';
      case 'deposited':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getDepositStatusText = () => {
    switch (userDepositStatus) {
      case 'not-deposited':
        return '미예치';
      case 'deposited':
        return '예치완료';
      case 'at-risk':
        return '위험상태';
      case 'completed':
        return '완료';
    }
  };

  const getAssignmentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'submitted':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'graded':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <p className="text-gray-600">{track} 트랙 • {cohortId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '개요', icon: BookOpen },
              { id: 'assignments', label: '과제', icon: BookOpen },
              { id: 'sessions', label: '스터디', icon: Users },
              { id: 'treasury', label: 'DAO 예치금', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 보증금 상태 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">보증금 상태</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDepositStatusColor()}`}>
                    {getDepositStatusText()}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">현재 상태</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{depositAmount} bUSD</p>
                  <p className="text-sm text-gray-600">예치 금액</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {userDepositStatus === 'at-risk' ? '⚠️' : '✅'}
                  </p>
                  <p className="text-sm text-gray-600">안전 상태</p>
                </div>
              </div>
              
              {userDepositStatus === 'at-risk' && (
                <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">보증금 위험 상태</p>
                      <p>과제 마감일을 놓치거나 성적이 기준에 미달할 경우 보증금이 차감될 수 있습니다.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 진행도 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">과제 진행도</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userProgress.completedAssignments}/{userProgress.totalAssignments}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(userProgress.completedAssignments / userProgress.totalAssignments) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-900">현재 점수</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">{userProgress.currentScore}점</p>
                <p className="text-sm text-gray-600">평균: 85점</p>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">완료율</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((userProgress.completedAssignments / userProgress.totalAssignments) * 100)}%
                </p>
                <p className="text-sm text-gray-600">목표: 80%</p>
              </div>
            </div>
          </div>
        )}

        {/* 과제 탭 */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {mockAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getAssignmentStatusIcon(assignment.status)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">마감: {assignment.dueDate}</p>
                    <p className="text-sm text-gray-600">가중치: {assignment.weight}%</p>
                    {assignment.score && (
                      <p className="font-semibold text-gray-900">{assignment.score}/{assignment.maxScore}점</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      assignment.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status === 'completed' ? '완료' :
                       assignment.status === 'in-progress' ? '진행중' :
                       assignment.status === 'submitted' ? '제출됨' : '대기중'}
                    </span>
                    {assignment.isRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        필수
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {assignment.status === 'pending' && (
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        시작하기
                      </button>
                    )}
                    {assignment.status === 'in-progress' && (
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        제출하기
                      </button>
                    )}
                    {assignment.status === 'completed' && (
                      <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        결과보기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 스터디 탭 */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {mockSessions.map((session) => (
              <div key={session.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <p className="text-sm text-gray-600">{session.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusColor(session.status)}`}>
                      {session.status === 'completed' ? '완료' :
                       session.status === 'active' ? '진행중' : '예정'}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {session.participants}/{session.maxParticipants}명 참여
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">참여자</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">일정</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {session.status === 'upcoming' && (
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        참여 신청
                      </button>
                    )}
                    {session.status === 'active' && (
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        참여하기
                      </button>
                    )}
                    {session.status === 'completed' && (
                      <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                        기록보기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DAO 예치금 탭 */}
        {activeTab === 'treasury' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DAO 예치금 풀 현황</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">1,250 bUSD</p>
                  <p className="text-sm text-gray-600">총 예치금</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">15명</p>
                  <p className="text-sm text-gray-600">참여자 수</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">83.3%</p>
                  <p className="text-sm text-gray-600">성공률</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">보증금 분배</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">성공 완료자</span>
                    <span className="text-sm font-medium">1,000 bUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">실패자 차감금</span>
                    <span className="text-sm font-medium">50 bUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">DAO 운영비</span>
                    <span className="text-sm font-medium">200 bUSD</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">최근 활동</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">김개발 보증금 반환</span>
                    <span className="text-green-600">+100 bUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이프론트 차감</span>
                    <span className="text-red-600">-25 bUSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">박백엔드 보증금 반환</span>
                    <span className="text-green-600">+100 bUSD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
