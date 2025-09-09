'use client';

import { useAccount } from 'wagmi';
import { TokenFaucet } from './TokenFaucet';
import { Coins, ArrowRight, BookOpen, Users } from 'lucide-react';

export function DAODashboard() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Coins className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">지갑을 연결해주세요</h2>
          <p className="text-gray-600">DAO에 참여하려면 먼저 지갑을 연결해야 합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bay DAO</h1>
          <p className="text-xl text-gray-600">블록체인 학습을 위한 DAO 플랫폼</p>
        </div>

        {/* 학습 여정 안내 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">학습 여정</h2>
          
          <div className="flex items-center justify-center space-x-8">
            {/* 1단계: 토큰 받기 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-purple-100 rounded-full">
                <Coins className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">1. 토큰 받기</h3>
              <p className="text-sm text-gray-600 text-center">테스트용 bUSD 받기</p>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400" />

            {/* 2단계: DAO 트랙 참여 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">2. DAO 트랙 참여</h3>
              <p className="text-sm text-gray-600 text-center">보증금 예치</p>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400" />

            {/* 3단계: 과제 수행 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-green-100 rounded-full">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">3. 과제 수행</h3>
              <p className="text-sm text-gray-600 text-center">학습 과제 완료</p>
            </div>
          </div>
        </div>

        {/* 토큰 받기 섹션 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Coins className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">토큰 받기</h2>
            <p className="text-gray-600">
              DAO 활동을 시작하기 위해 테스트용 bUSD 토큰을 받아보세요.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <TokenFaucet />
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">토큰을 받은 후 다음 단계로 진행하세요:</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#dao-track" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              DAO 트랙 보기
            </a>
            <a 
              href="#assignments" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              과제 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}