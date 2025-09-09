'use client';

import { useState } from 'react';
import { X, FileText, Calendar, Star, Users, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId?: string;
}

export function CreateAssignmentModal({ isOpen, onClose, cohortId }: CreateAssignmentModalProps) {
  const { dispatch, state } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    weight: '',
    maxScore: '100',
    submissionType: 'file' as 'file' | 'url' | 'both',
    requirements: '',
    rubric: '',
    selectedCohortId: cohortId || '',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate || !formData.selectedCohortId) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsCreating(true);
    try {
      // 새로운 과제 ID 생성 (실제로는 서버에서 생성)
      const newAssignmentId = Date.now();
      
      // 과제 데이터 생성
      const newAssignment = {
        id: newAssignmentId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        status: 'pending' as const,
        maxScore: parseInt(formData.maxScore),
        weight: parseInt(formData.weight) || 0,
        isRequired: true,
        cohortId: formData.selectedCohortId,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Context에 과제 추가
      dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
      
      setIsCreating(false);
      onClose();
      alert('과제가 성공적으로 생성되었습니다!');
      
      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        weight: '',
        maxScore: '100',
        submissionType: 'file',
        requirements: '',
        rubric: '',
        selectedCohortId: cohortId || '',
      });
    } catch (error) {
      console.error('Assignment creation failed:', error);
      setIsCreating(false);
      alert('과제 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">새 과제 생성</h2>
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
            <h3 className="text-lg font-semibold text-gray-900">과제 정보</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DAO 트랙 선택 *
              </label>
              <select
                name="selectedCohortId"
                value={formData.selectedCohortId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">DAO 트랙을 선택하세요</option>
                {state.cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name} ({cohort.track} 트랙)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                과제명 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="예: React Todo App 구현"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                과제 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="과제에 대한 상세한 설명을 입력하세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  마감일 *
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제출 방식
                </label>
                <select
                  name="submissionType"
                  value={formData.submissionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="file">파일 업로드</option>
                  <option value="url">URL 링크</option>
                  <option value="both">파일 또는 URL</option>
                </select>
              </div>
            </div>
          </div>

          {/* 점수 및 가중치 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">평가 기준</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 점수
                </label>
                <input
                  type="number"
                  name="maxScore"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가중치 (%)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="20"
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 요구사항 및 루브릭 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">상세 요구사항</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                필수 요구사항
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                placeholder="예: React Hooks 사용, TypeScript 적용, 반응형 디자인, GitHub 배포 등..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                채점 루브릭
              </label>
              <textarea
                name="rubric"
                value={formData.rubric}
                onChange={handleInputChange}
                rows={4}
                placeholder="예: 기능 구현 (40점), 코드 품질 (30점), UI/UX (20점), 문서화 (10점)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">과제 생성 시 주의사항:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>과제 생성 후에는 기본 정보를 수정할 수 없습니다</li>
                  <li>마감일 이후 제출된 과제는 지연 제출로 처리됩니다</li>
                  <li>가중치는 전체 기수 점수에서의 비율을 나타냅니다</li>
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
              disabled={isCreating || !formData.title || !formData.dueDate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? '생성 중...' : '과제 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
