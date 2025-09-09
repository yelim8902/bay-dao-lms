'use client';

import { useState } from 'react';
import { X, Upload, FileText, Link } from 'lucide-react';
import { useWriteContract } from 'wagmi';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: number;
  title: string;
  onSubmit?: () => void;
}

export function AssignmentModal({ isOpen, onClose, assignmentId, title, onSubmit }: AssignmentModalProps) {
  const [submissionType, setSubmissionType] = useState<'file' | 'url'>('file');
  const [submissionData, setSubmissionData] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract } = useWriteContract();

  const handleSubmit = async () => {
    if (!submissionData.trim()) return;
    
    setIsSubmitting(true);
    try {
      // 실제 컨트랙트 호출 로직
      console.log('Submitting assignment:', {
        assignmentId,
        type: submissionType,
        data: submissionData,
        description
      });
      
      // 데모용: 2초 후 성공 처리
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        
        // 부모 컴포넌트의 onSubmit 콜백 호출
        if (onSubmit) {
          onSubmit();
        } else {
          alert('과제가 성공적으로 제출되었습니다!');
        }
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">과제 제출</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">과제 #{assignmentId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제출 방식
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={submissionType === 'file'}
                  onChange={(e) => setSubmissionType(e.target.value as 'file')}
                  className="mr-2"
                />
                <FileText className="h-4 w-4 mr-1" />
                파일 업로드
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={submissionType === 'url'}
                  onChange={(e) => setSubmissionType(e.target.value as 'url')}
                  className="mr-2"
                />
                <Link className="h-4 w-4 mr-1" />
                URL 링크
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {submissionType === 'file' ? '파일 업로드' : '제출 URL'}
            </label>
            {submissionType === 'file' ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-sm text-gray-500">PDF, ZIP, 이미지 파일 지원</p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSubmissionData(file.name);
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  파일 선택
                </label>
              </div>
            ) : (
              <input
                type="url"
                value={submissionData}
                onChange={(e) => setSubmissionData(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제출 설명 (선택사항)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="과제에 대한 설명이나 특이사항을 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600">⚠️</div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">제출 전 확인사항:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>제출한 내용이 과제 요구사항을 충족하는지 확인하세요</li>
                  <li>제출 후에는 수정이 불가능합니다</li>
                  <li>마감 시간 이후 제출 시 지연 제출로 처리됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !submissionData.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : '과제 제출'}
          </button>
        </div>
      </div>
    </div>
  );
}
