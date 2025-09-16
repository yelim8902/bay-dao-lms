"use client";

import React from "react";
import { Award, Calendar, Trophy } from "lucide-react";

interface Certificate {
  id: number;
  tokenId: number;
  name: string;
  cohortId: string;
  issuedAt: string;
  status: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
}

export function CertificateCard({
  certificate,
  onClick,
}: CertificateCardProps) {
  // certificate가 없으면 렌더링하지 않음
  if (!certificate) {
    return null;
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:border-blue-300"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {certificate.name}
            </h3>
            <p className="text-sm text-gray-600">{certificate.cohortId}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-yellow-600">
            <Trophy className="h-4 w-4" />
            <span className="font-bold text-lg">95점</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {certificate.name} 과정을 성공적으로 완료했습니다.
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>발급일: {certificate.issuedAt}</span>
        </div>
        <span className="text-blue-600 font-medium">인증서 보기</span>
      </div>
    </div>
  );
}
