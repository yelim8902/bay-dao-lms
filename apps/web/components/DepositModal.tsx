"use client";

import React, { useState } from "react";
import { X, DollarSign, AlertCircle } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  cohortName: string;
  amount: number;
  isDepositing: boolean;
}

export function DepositModal({
  isOpen,
  onClose,
  onDeposit,
  cohortName,
  amount,
  isDepositing,
}: DepositModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">보증금 예치</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">{cohortName}</span>
            </div>
            <p className="text-blue-800 text-sm">
              보증금: <strong>{amount} bUSD</strong>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">보증금 안내</p>
                <ul className="space-y-1 text-xs">
                  <li>• 모든 과제 완료 시 보증금을 돌려받습니다</li>
                  <li>• 과제 미완료 시 보증금이 DAO에 기여됩니다</li>
                  <li>• 학습 동기 부여를 위한 시스템입니다</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => onDeposit(amount)}
              disabled={isDepositing}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDepositing ? "예치 중..." : `${amount} bUSD 예치하기`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
