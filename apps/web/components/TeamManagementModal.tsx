'use client';

import { useState } from 'react';
import { X, Users, UserPlus, UserMinus, Crown, Mail, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  address: string;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string;
  status: 'active' | 'pending' | 'left';
}

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId: string;
  teamId?: string;
}

export function TeamManagementModal({ isOpen, onClose, cohortId, teamId }: TeamManagementModalProps) {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      address: '0x1234...5678',
      name: '김개발',
      role: 'leader',
      joinedAt: '2024-01-01',
      status: 'active'
    },
    {
      id: '2',
      address: '0x2345...6789',
      name: '이프론트',
      role: 'member',
      joinedAt: '2024-01-02',
      status: 'active'
    },
    {
      id: '3',
      address: '0x3456...7890',
      name: '박백엔드',
      role: 'member',
      joinedAt: '2024-01-03',
      status: 'pending'
    }
  ]);
  
  const [isInviting, setIsInviting] = useState(false);
  const [inviteAddress, setInviteAddress] = useState('');

  const handleInvite = async () => {
    if (!inviteAddress.trim()) return;
    
    setIsInviting(true);
    try {
      // 실제 초대 로직
      console.log('Inviting member:', inviteAddress);
      
      setTimeout(() => {
        setIsInviting(false);
        setInviteAddress('');
        alert('팀원 초대가 완료되었습니다!');
      }, 1500);
    } catch (error) {
      console.error('Invite failed:', error);
      setIsInviting(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('정말로 이 팀원을 제거하시겠습니까?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const handleTransferLeadership = (memberId: string) => {
    if (confirm('리더십을 이 팀원에게 양도하시겠습니까?')) {
      setMembers(prev => prev.map(member => ({
        ...member,
        role: member.id === memberId ? 'leader' : 'member'
      })));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">팀 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 팀 초대 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">팀원 초대</h3>
            <div className="flex space-x-3">
              <input
                type="text"
                value={inviteAddress}
                onChange={(e) => setInviteAddress(e.target.value)}
                placeholder="지갑 주소를 입력하세요 (0x...)"
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleInvite}
                disabled={isInviting || !inviteAddress.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isInviting ? '초대 중...' : '초대'}</span>
              </button>
            </div>
          </div>

          {/* 팀원 목록 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">팀원 목록</h3>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {member.role === 'leader' && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{member.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === 'active' ? 'bg-green-100 text-green-800' :
                              member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {member.status === 'active' ? '활성' : 
                               member.status === 'pending' ? '대기중' : '탈퇴'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-mono">{member.address}</p>
                          <p className="text-xs text-gray-500">가입일: {member.joinedAt}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.role !== 'leader' && member.status === 'active' && (
                        <button
                          onClick={() => handleTransferLeadership(member.id)}
                          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                        >
                          리더로 지정
                        </button>
                      )}
                      {member.status === 'active' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center space-x-1"
                        >
                          <UserMinus className="h-3 w-3" />
                          <span>제거</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 팀 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              <p className="text-sm text-gray-600">총 팀원</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">활성 팀원</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.role === 'leader').length}
              </p>
              <p className="text-sm text-gray-600">리더</p>
            </div>
          </div>

          {/* 팀 규칙 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">팀 규칙</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>팀 리더는 팀원을 초대하고 제거할 수 있습니다</li>
              <li>팀원은 자유롭게 팀을 떠날 수 있습니다</li>
              <li>팀 과제는 모든 팀원이 협력하여 완료해야 합니다</li>
              <li>팀 내 분쟁이 있을 경우 관리자에게 문의하세요</li>
            </ul>
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
