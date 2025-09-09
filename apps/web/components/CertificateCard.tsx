'use client';

import { useState } from 'react';
import { Award, ExternalLink, Shield, Calendar } from 'lucide-react';
import { CertificateModal } from './CertificateModal';

interface CertificateCardProps {
  tokenId: number;
  name: string;
  cohortId: string;
  issuedAt: string;
  status: 'completed' | 'pending' | 'revoked';
  onClick?: () => void;
}

export function CertificateCard({ 
  tokenId, 
  name, 
  cohortId, 
  issuedAt, 
  status,
  onClick
}: CertificateCardProps) {
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'revoked':
        return <Award className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return '발급완료';
      case 'pending':
        return '발급대기';
      case 'revoked':
        return '취소됨';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div 
          className={`flex items-center space-x-2 flex-1 ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <Award className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className={`text-lg font-semibold text-gray-900 ${onClick ? 'hover:text-blue-600 transition-colors' : ''}`}>
              {name}
            </h3>
            <p className="text-sm text-gray-600">Token ID: #{tokenId}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>발급일: {issuedAt}</span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-mono">Cohort: {cohortId}</span>
            <span className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>SBT</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        {status === 'completed' && (
          <>
            <button 
              onClick={() => setIsCertificateModalOpen(true)}
              className="btn-primary flex-1 text-sm"
            >
              인증서 보기
            </button>
            <button className="btn-secondary text-sm">
              <ExternalLink className="h-4 w-4" />
            </button>
          </>
        )}
        {status === 'pending' && (
          <button className="btn-secondary w-full text-sm" disabled>
            발급 대기 중
          </button>
        )}
        {status === 'revoked' && (
          <button className="btn-secondary w-full text-sm" disabled>
            취소된 인증서
          </button>
        )}
      </div>

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        tokenId={tokenId}
        name={name}
        cohortId={cohortId}
        issuedAt={issuedAt}
      />
    </div>
  );
}
