'use client';

import { useState } from 'react';
import { X, Award, ExternalLink, Copy, CheckCircle } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number;
  name: string;
  cohortId: string;
  issuedAt: string;
}

export function CertificateModal({ 
  isOpen, 
  onClose, 
  tokenId, 
  name, 
  cohortId, 
  issuedAt 
}: CertificateModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const certificateUrl = `https://opensea.io/assets/sepolia/${process.env.NEXT_PUBLIC_BAY_CERTIFICATE_ADDRESS}/${tokenId}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">인증서 상세</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 인증서 헤더 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg text-center">
            <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-600">Token ID: #{tokenId}</p>
          </div>

          {/* 인증서 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">기본 정보</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">토큰 ID:</span>
                  <span className="font-mono">{tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">발급일:</span>
                  <span>{issuedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">네트워크:</span>
                  <span>Sepolia</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">기수 정보</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">기수 ID:</span>
                  <span className="font-mono text-xs">{cohortId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태:</span>
                  <span className="text-green-600 font-medium">완료</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">타입:</span>
                  <span>SBT (Soulbound Token)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 검증 정보 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">검증 정보</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">EAS 증명:</span>
                <span className="font-mono text-xs text-green-800">0x1234...5678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">검증 상태:</span>
                <span className="text-green-600 font-medium">✓ 검증됨</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">발급자:</span>
                <span className="font-mono text-xs text-green-800">0xBayLMS...1234</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(certificateUrl, '_blank')}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>OpenSea에서 보기</span>
              </button>
              <button
                onClick={() => handleCopy(certificateUrl)}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? '복사됨!' : 'URL 복사'}</span>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleCopy(`Token ID: ${tokenId}\nCohort: ${cohortId}\nIssued: ${issuedAt}`)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                인증서 정보 복사
              </button>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600">⚠️</div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">SBT (Soulbound Token) 특성:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>이 인증서는 전송할 수 없습니다</li>
                  <li>오직 본인만이 소유할 수 있습니다</li>
                  <li>학습 성취를 증명하는 디지털 인증서입니다</li>
                </ul>
              </div>
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
