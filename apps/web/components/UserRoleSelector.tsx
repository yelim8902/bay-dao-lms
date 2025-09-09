'use client';

import { useState } from 'react';
import { GraduationCap, Settings, User, Shield, Building2 } from 'lucide-react';

interface UserRoleSelectorProps {
  onRoleChange: (role: 'student' | 'instructor' | 'admin' | 'dao') => void;
  currentRole: 'student' | 'instructor' | 'admin' | 'dao';
}

export function UserRoleSelector({ onRoleChange, currentRole }: UserRoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'dao',
      name: 'DAO',
      description: '보증금 관리 및 거버넌스',
      icon: Building2,
      color: 'text-purple-600'
    },
    {
      id: 'student',
      name: '학생',
      description: '기수 참여 및 과제 제출',
      icon: User,
      color: 'text-blue-600'
    },
    {
      id: 'instructor',
      name: '강사',
      description: '과제 생성 및 채점',
      icon: GraduationCap,
      color: 'text-green-600'
    },
    {
      id: 'admin',
      name: '관리자',
      description: '기수 생성 및 전체 관리',
      icon: Settings,
      color: 'text-orange-600'
    }
  ];

  const currentRoleData = roles.find(role => role.id === currentRole);
  const IconComponent = currentRoleData?.icon || User;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <IconComponent className={`h-4 w-4 ${currentRoleData?.color}`} />
        <span className="text-sm font-medium text-gray-700">{currentRoleData?.name}</span>
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              역할 선택
            </div>
            {roles.map((role) => {
              const RoleIcon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id as any);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    currentRole === role.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <RoleIcon className={`h-5 w-5 mt-0.5 ${role.color}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    <div className="text-xs text-gray-500">{role.description}</div>
                  </div>
                  {currentRole === role.id && (
                    <Shield className="h-4 w-4 text-blue-600 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
