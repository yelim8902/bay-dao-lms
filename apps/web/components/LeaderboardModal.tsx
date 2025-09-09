'use client';

import { useState } from 'react';
import { X, Trophy, Medal, Star, TrendingUp, Users, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  address: string;
  name: string;
  totalScore: number;
  completedAssignments: number;
  teamName?: string;
  badges: string[];
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId: string;
}

export function LeaderboardModal({ isOpen, onClose, cohortId }: LeaderboardModalProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'individual' | 'team'>('individual');

  const mockData: LeaderboardEntry[] = [
    {
      rank: 1,
      address: '0x1234...5678',
      name: '김개발',
      totalScore: 950,
      completedAssignments: 8,
      teamName: 'Dev Masters',
      badges: ['first-place', 'speed-demon', 'perfectionist']
    },
    {
      rank: 2,
      address: '0x2345...6789',
      name: '이프론트',
      totalScore: 920,
      completedAssignments: 7,
      teamName: 'UI Wizards',
      badges: ['second-place', 'creative-genius']
    },
    {
      rank: 3,
      address: '0x3456...7890',
      name: '박백엔드',
      totalScore: 890,
      completedAssignments: 8,
      teamName: 'Dev Masters',
      badges: ['third-place', 'team-player']
    },
    {
      rank: 4,
      address: '0x4567...8901',
      name: '최풀스택',
      totalScore: 870,
      completedAssignments: 6,
      teamName: 'Full Stack Heroes',
      badges: ['rising-star']
    },
    {
      rank: 5,
      address: '0x5678...9012',
      name: '정데이터',
      totalScore: 850,
      completedAssignments: 7,
      teamName: 'Data Scientists',
      badges: ['analyst']
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'first-place':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'second-place':
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 'third-place':
        return <Medal className="h-4 w-4 text-amber-600" />;
      case 'speed-demon':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'perfectionist':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'creative-genius':
        return <Award className="h-4 w-4 text-pink-500" />;
      case 'team-player':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'rising-star':
        return <Star className="h-4 w-4 text-orange-500" />;
      case 'analyst':
        return <TrendingUp className="h-4 w-4 text-indigo-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeName = (badge: string) => {
    const badgeNames: { [key: string]: string } = {
      'first-place': '1등',
      'second-place': '2등',
      'third-place': '3등',
      'speed-demon': '속도왕',
      'perfectionist': '완벽주의자',
      'creative-genius': '창의적 천재',
      'team-player': '팀플레이어',
      'rising-star': '떠오르는 별',
      'analyst': '데이터 분석가'
    };
    return badgeNames[badge] || badge;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">랭킹</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 필터 */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="month">이번 달</option>
                <option value="week">이번 주</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">분류</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="individual">개인</option>
                <option value="team">팀</option>
              </select>
            </div>
          </div>

          {/* 상위 3명 하이라이트 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {mockData.slice(0, 3).map((entry) => (
              <div key={entry.rank} className={`p-4 rounded-lg ${
                entry.rank === 1 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300' :
                entry.rank === 2 ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300' :
                'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300'
              }`}>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(entry.rank)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{entry.name}</h3>
                  <p className="text-sm text-gray-600 font-mono">{entry.address}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{entry.totalScore}점</p>
                  <p className="text-sm text-gray-600">{entry.completedAssignments}개 과제 완료</p>
                  {entry.teamName && (
                    <p className="text-xs text-gray-500 mt-1">팀: {entry.teamName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 전체 랭킹 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">전체 랭킹</h3>
            <div className="space-y-2">
              {mockData.map((entry) => (
                <div key={entry.rank} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(entry.rank)}
                        <div>
                          <h4 className="font-medium text-gray-900">{entry.name}</h4>
                          <p className="text-sm text-gray-600 font-mono">{entry.address}</p>
                          {entry.teamName && (
                            <p className="text-xs text-gray-500">팀: {entry.teamName}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{entry.totalScore}점</p>
                        <p className="text-sm text-gray-600">{entry.completedAssignments}개 과제</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {entry.badges.slice(0, 3).map((badge) => (
                          <div
                            key={badge}
                            className="flex items-center space-x-1 px-2 py-1 bg-white rounded-full text-xs"
                            title={getBadgeName(badge)}
                          >
                            {getBadgeIcon(badge)}
                            <span className="hidden sm:inline">{getBadgeName(badge)}</span>
                          </div>
                        ))}
                        {entry.badges.length > 3 && (
                          <div className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                            +{entry.badges.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{mockData.length}</p>
              <p className="text-sm text-gray-600">총 참여자</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(mockData.reduce((sum, entry) => sum + entry.totalScore, 0) / mockData.length)}
              </p>
              <p className="text-sm text-gray-600">평균 점수</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {mockData.reduce((sum, entry) => sum + entry.completedAssignments, 0)}
              </p>
              <p className="text-sm text-gray-600">완료된 과제</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...mockData.map(entry => entry.totalScore))}
              </p>
              <p className="text-sm text-gray-600">최고 점수</p>
            </div>
          </div>
        </div>

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
