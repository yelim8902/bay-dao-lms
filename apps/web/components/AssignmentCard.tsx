"use client";

import React from "react";
import { CheckCircle, Clock, FileText } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  weight: number;
}

interface AssignmentCardProps {
  assignment: Assignment;
  isSubmitted: boolean;
  maxScore: number;
  weight: number;
  cohortName: string;
  onClick: () => void;
  onSubmit: () => void;
}

export function AssignmentCard({
  assignment,
  isSubmitted,
  maxScore,
  weight,
  cohortName,
  onClick,
  onSubmit,
}: AssignmentCardProps) {
  // assignment가 없으면 렌더링하지 않음
  if (!assignment) {
    return null;
  }

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSubmitted
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isSubmitted ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <FileText className="h-5 w-5 text-gray-400" />
          )}
          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {weight}%
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {assignment.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock className="h-4 w-4" />
          <span>마감: {assignment.dueDate}</span>
        </div>
        <span className="text-gray-500">{maxScore}점</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        {isSubmitted ? (
          <div className="flex items-center justify-between">
            <span className="text-green-600 text-sm font-medium">
              ✅ 제출 완료
            </span>
            <span className="text-green-600 text-sm">95점</span>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            제출하기
          </button>
        )}
      </div>
    </div>
  );
}
