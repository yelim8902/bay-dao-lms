'use client';

import { useState } from 'react';
import { X, Users, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useWriteContract } from 'wagmi';

interface CreateCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCohortModal({ isOpen, onClose }: CreateCohortModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    track: 'development' as 'research' | 'development',
    depositAmount: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    requirements: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract } = useWriteContract();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.depositAmount) return;

    setIsCreating(true);
    try {
      // 새로운 기수 ID 생성 (실제로는 서버에서 생성)
      const newCohortId = `0x${Date.now().toString(16)}...`;
      
      // 기수 데이터 생성
      const newCohort = {
        id: newCohortId,
        name: formData.name,
        description: formData.description,
        track: formData.track,
        depositAmount: formData.depositAmount,
        maxParticipants: parseInt(formData.maxParticipants) || 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        requirements: formData.requirements,
        status: 'upcoming' as const,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Context에 기수 추가
      dispatch({ type: 'ADD_COHORT', payload: newCohort });
      
      setIsCreating(false);
      onClose();
      alert('기수가 성공적으로 생성되었습니다!');
      
      // 폼 초기화
      setFormData({
        name: '',
        description: '',
        track: 'development',
        depositAmount: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        requirements: '',
      });
    } catch (error) {
      console.error('Cohort creation failed:', error);
      setIsCreating(false);
      alert('기수 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">새 기수 생성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기수명 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="예: Bay Development Track 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="기수에 대한 상세 설명을 입력하세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  트랙 *
                </label>
                <select
                  name="track"
                  value={formData.track}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="development">Development</option>
                  <option value="research">Research</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 참여자 수
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="50"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 금액 및 일정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">금액 및 일정</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보증금 (bUSD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 요구사항 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">참여 요구사항</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                필수 요구사항
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                placeholder="예: React, TypeScript 경험, GitHub 계정, Discord 참여 등..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">기수 생성 시 주의사항:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>기수 생성 후에는 기본 정보를 수정할 수 없습니다</li>
                  <li>보증금은 참여자들이 예치해야 하는 금액입니다</li>
                  <li>기수 생성 시 가스비가 발생합니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isCreating || !formData.name || !formData.depositAmount}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? '생성 중...' : '기수 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
