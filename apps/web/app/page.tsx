'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Header } from '../components/Header';
import { UserRoleSelector } from '../components/UserRoleSelector';
import { StudentDashboard } from '../components/StudentDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { DAODashboard } from '../components/DAODashboard';
import { useEffect, useState } from 'react';

type UserRole = 'student' | 'instructor' | 'admin' | 'dao';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('student');

  // Hydration 에러 방지를 위한 마운트 상태 관리
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration 에러 방지
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bay LMS에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              보증금으로 학습을 보장하는 탈중앙화 학습 관리 시스템
            </p>
            <div className="animate-pulse bg-gray-200 h-10 w-32 mx-auto rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return address ? <StudentDashboard address={address} /> : <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">학생 대시보드</h2>
          <p className="text-gray-600">지갑을 연결해주세요.</p>
        </div>;
      case 'instructor':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">강사 대시보드</h2>
          <p className="text-gray-600">강사 기능은 준비 중입니다.</p>
        </div>;
      case 'admin':
        return address ? <AdminDashboard address={address} /> : <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">관리자 대시보드</h2>
          <p className="text-gray-600">지갑을 연결해주세요.</p>
        </div>;
      case 'dao':
        return <DAODashboard />;
      default:
        return <DAODashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-4xl mx-auto">
            {/* 히어로 섹션 */}
            <div className="text-center py-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Bay DAO에서<br />
                <span className="text-blue-600">학습하고 성장하세요</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                보증금으로 학습을 보장하는 탈중앙화 학습 관리 시스템.<br />
                과제를 완료하면 보증금을 돌려받고, 실패하면 DAO에 기여하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ConnectButton />
                <button className="btn-secondary">
                  더 알아보기
                </button>
              </div>
            </div>

            {/* 학습 과정 안내 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">DAO 트랙 참여</h3>
                <p className="text-gray-600 text-sm">원하는 학습 트랙의 DAO에 참여하세요</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">보증금 예치</h3>
                <p className="text-gray-600 text-sm">100 bUSD 보증금을 예치하여 학습을 시작하세요</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">과제 수행</h3>
                <p className="text-gray-600 text-sm">제공된 과제들을 열심히 수행하세요</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">보증금 반환</h3>
                <p className="text-gray-600 text-sm">모든 과제 완료 시 보증금을 돌려받으세요</p>
              </div>
            </div>

            {/* 현재 진행 중인 기수들 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">현재 진행 중인 DAO 트랙</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bay Research Track 2024</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">진행중</span>
                  </div>
                  <p className="text-gray-600 mb-4">블록체인 연구를 위한 심화 과정</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>보증금: 100 bUSD</span>
                    <span>참여자: 15/20명</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bay Development Track 2024</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">모집중</span>
                  </div>
                  <p className="text-gray-600 mb-4">실무 중심의 개발 과정</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>보증금: 150 bUSD</span>
                    <span>참여자: 8/25명</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DAO 통계 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bay DAO 현황</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">$5,000</p>
                  <p className="text-gray-600">총 예치금</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">25명</p>
                  <p className="text-gray-600">참여자</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">85%</p>
                  <p className="text-gray-600">성공률</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">2개</p>
                  <p className="text-gray-600">활성 DAO 트랙</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 환영 메시지와 역할 선택기 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    환영합니다! 👋
                  </h2>
                  <p className="text-gray-600">
                    지갑이 연결되었습니다. 어떤 역할로 시작하시겠습니까?
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">역할 선택:</span>
                  <UserRoleSelector 
                    onRoleChange={(role) => setUserRole(role as UserRole)}
                    currentRole={userRole as 'student' | 'instructor' | 'admin'}
                  />
                </div>
              </div>
            </div>
            
            {/* 선택된 역할에 따른 대시보드 */}
            {renderDashboard()}
          </div>
        )}
      </main>
    </div>
  );
}
