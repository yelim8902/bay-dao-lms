"use client";

import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import {
  Users,
  BookOpen,
  Plus,
  Settings,
  BarChart3,
  Award,
  DollarSign,
  Calendar,
  Target,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

interface AdminDashboardProps {
  address: string;
}

export function AdminDashboard({ address }: AdminDashboardProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<
    "overview" | "tracks" | "assignments" | "students"
  >("overview");
  const [isCreateTrackModalOpen, setIsCreateTrackModalOpen] = useState(false);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);

  // 관리자 통계
  const adminStats = {
    totalTracks: state.cohorts.length,
    activeTracks: state.cohorts.filter((c) => c.status === "active").length,
    totalStudents: state.enrollments.length,
    totalAssignments: state.assignments.length,
    completedAssignments: state.enrollments.reduce(
      (sum, e) => sum + e.completedAssignments.length,
      0
    ),
    totalDeposits: state.enrollments.length * 100, // 가정: 각 학생당 100 bUSD
    // DAO 자금 계산
    daoTreasury: calculateDAOTreasury(),
    slashedFunds: calculateSlashedFunds(),
  };

  // DAO 금고 계산 함수 (현재 보유 중인 총 자금)
  function calculateDAOTreasury() {
    const totalDeposited = state.enrollments.length * 100; // 총 예치금
    const totalRefunded =
      state.enrollments.filter(
        (e) =>
          e.completedAssignments.length ===
          state.assignments.filter((a) => a.cohortId === e.cohortId).length
      ).length * 100; // 완료한 학생들의 반환금

    // DAO 금고 = 총 예치금 - 이미 반환된 금액
    return totalDeposited - totalRefunded;
  }

  // 차감된 자금 계산 (미완료로 인해 DAO가 얻은 순수익)
  function calculateSlashedFunds() {
    const incompleteStudents = state.enrollments.filter(
      (e) =>
        e.completedAssignments.length <
        state.assignments.filter((a) => a.cohortId === e.cohortId).length
    ).length;
    return incompleteStudents * 20; // 학생당 20 bUSD 차감 가정 (보증금의 20%)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 관리자 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {adminStats.totalTracks}
              </p>
              <p className="text-sm text-gray-600">총 DAO 트랙</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">
                {adminStats.totalStudents}
              </p>
              <p className="text-sm text-gray-600">참여 학생</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-purple-600">
                {adminStats.totalAssignments}
              </p>
              <p className="text-sm text-gray-600">총 과제</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-yellow-600">
                ${adminStats.totalDeposits}
              </p>
              <p className="text-sm text-gray-600">총 예치금</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* DAO 자금 하이라이트 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold mb-2">
                ${adminStats.daoTreasury}
              </p>
              <h3 className="text-xl font-semibold mb-1">🏛️ DAO 금고</h3>
              <p className="text-orange-100 text-sm">미완료 학생들의 차감금</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
              <Award className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-400">
            <p className="text-xs text-orange-100">
              💡 이 자금은 DAO 운영 및 개발에 사용됩니다
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold mb-2">
                {Math.round(
                  (adminStats.completedAssignments /
                    (adminStats.totalAssignments || 1)) *
                    100
                )}
                %
              </p>
              <h3 className="text-xl font-semibold mb-1">📈 과제 완료율</h3>
              <p className="text-blue-100 text-sm">전체 과제 대비 완료 비율</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <p className="text-xs text-blue-100">
              📊 {adminStats.completedAssignments}/{adminStats.totalAssignments}{" "}
              과제 완료
            </p>
          </div>
        </div>
      </div>

      {/* DAO 자금 현황 상세 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-6 w-6 text-green-600 mr-2" />
          DAO 자금 현황
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💰 총 예치금</h4>
            <p className="text-2xl font-bold text-blue-600">
              ${adminStats.totalDeposits}
            </p>
            <p className="text-sm text-blue-700">
              {state.enrollments.length}명 × 100 bUSD
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              ✅ 반환 예정금
            </h4>
            <p className="text-2xl font-bold text-green-600">
              ${adminStats.totalDeposits - adminStats.slashedFunds}
            </p>
            <p className="text-sm text-green-700">과제 완료 학생들에게 반환</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">
              🎯 DAO 순수익
            </h4>
            <p className="text-2xl font-bold text-orange-600">
              ${adminStats.slashedFunds}
            </p>
            <p className="text-sm text-orange-700">
              미완료 학생 차감금 (순수익)
            </p>
          </div>
        </div>

        {/* 자금 흐름 차트 */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">자금 흐름</h4>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">총 예치금</span>
              <span className="text-sm font-semibold">
                ${adminStats.totalDeposits}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-green-600">💚 반환 예정:</span>
                <span className="font-semibold">
                  ${adminStats.totalDeposits - adminStats.slashedFunds}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">🏛️ DAO 보유:</span>
                <span className="font-semibold">${adminStats.daoTreasury}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">🎯 DAO 순수익:</span>
                <span className="font-semibold text-orange-600">
                  ${adminStats.slashedFunds}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
          최근 활동
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700">
                DAO 금고에 20 bUSD가 추가되었습니다 (과제 미완료)
              </span>
            </div>
            <span className="text-sm text-gray-500">1분 전</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                새로운 학생이 Bay Research Track에 참여했습니다 (+100 bUSD)
              </span>
            </div>
            <span className="text-sm text-gray-500">2분 전</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">
                과제 "이더리움 기초 공부하기"가 제출되었습니다
              </span>
            </div>
            <span className="text-sm text-gray-500">5분 전</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">
                100 bUSD가 학생에게 반환되었습니다 (과제 완료)
              </span>
            </div>
            <span className="text-sm text-gray-500">8분 전</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">
                새로운 보증금 예치가 완료되었습니다 (+100 bUSD)
              </span>
            </div>
            <span className="text-sm text-gray-500">10분 전</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracks = () => (
    <div className="space-y-6">
      {/* 트랙 생성 버튼 */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">DAO 트랙 관리</h3>
        <button
          onClick={() => setIsCreateTrackModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />새 트랙 생성
        </button>
      </div>

      {/* 트랙 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {state.cohorts.map((cohort) => {
          const enrollmentCount = state.enrollments.filter(
            (e) => e.cohortId === cohort.id
          ).length;
          const assignmentCount = state.assignments.filter(
            (a) => a.cohortId === cohort.id
          ).length;

          return (
            <div
              key={cohort.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {cohort.name}
                  </h4>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      cohort.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {cohort.status === "active" ? "진행중" : "대기중"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{cohort.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">참여 학생</p>
                  <p className="font-semibold">
                    {enrollmentCount}/{cohort.maxParticipants}명
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">과제 수</p>
                  <p className="font-semibold">{assignmentCount}개</p>
                </div>
                <div>
                  <p className="text-gray-500">보증금</p>
                  <p className="font-semibold">{cohort.depositAmount} bUSD</p>
                </div>
                <div>
                  <p className="text-gray-500">기간</p>
                  <p className="font-semibold">
                    {cohort.startDate} ~ {cohort.endDate}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      {/* 과제 생성 버튼 */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">과제 관리</h3>
        <button
          onClick={() => setIsCreateAssignmentModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />새 과제 생성
        </button>
      </div>

      {/* 과제 목록 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  과제명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  트랙
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마감일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가중치
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제출률
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.assignments.map((assignment) => {
                const cohort = state.cohorts.find(
                  (c) => c.id === assignment.cohortId
                );
                const submissionCount = state.enrollments.filter(
                  (e) =>
                    e.cohortId === assignment.cohortId &&
                    e.completedAssignments.includes(assignment.id)
                ).length;
                const totalStudents = state.enrollments.filter(
                  (e) => e.cohortId === assignment.cohortId
                ).length;
                const submissionRate =
                  totalStudents > 0
                    ? Math.round((submissionCount / totalStudents) * 100)
                    : 0;

                return (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.description.slice(0, 50)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {cohort?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.weight}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${submissionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {submissionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">학생 관리</h3>

      {/* 학생 목록 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  학생 주소
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  참여 트랙
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  완료 과제
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.enrollments.map((enrollment, index) => {
                const cohort = state.cohorts.find(
                  (c) => c.id === enrollment.cohortId
                );
                const totalAssignments = state.assignments.filter(
                  (a) => a.cohortId === enrollment.cohortId
                ).length;

                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.studentAddress.slice(0, 8)}...
                        {enrollment.studentAddress.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {cohort?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.completedAssignments.length}/
                      {totalAssignments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(enrollment.enrolledAt).toLocaleDateString(
                        "ko-KR"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          enrollment.completedAssignments.length ===
                          totalAssignments
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {enrollment.completedAssignments.length ===
                        totalAssignments
                          ? "완료"
                          : "진행중"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 관리자 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
        <p className="text-indigo-100">Bay DAO 학습 관리 시스템을 관리하세요</p>
        <div className="mt-4 text-sm text-indigo-200">
          관리자: {address.slice(0, 8)}...{address.slice(-6)}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "개요", icon: BarChart3 },
              { id: "tracks", label: "트랙 관리", icon: Target },
              { id: "assignments", label: "과제 관리", icon: BookOpen },
              { id: "students", label: "학생 관리", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 탭 내용 */}
        <div className="p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "tracks" && renderTracks()}
          {activeTab === "assignments" && renderAssignments()}
          {activeTab === "students" && renderStudents()}
        </div>
      </div>

      {/* 트랙 생성 모달 (간단한 폼) */}
      {isCreateTrackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              새 DAO 트랙 생성
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  트랙명
                </label>
                <input
                  type="text"
                  placeholder="예: Bay AI Track 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  placeholder="트랙 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  보증금 (bUSD)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  최대 참여자
                </label>
                <input
                  type="number"
                  placeholder="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreateTrackModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert("🎉 새 트랙이 생성되었습니다!");
                  setIsCreateTrackModalOpen(false);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 과제 생성 모달 (간단한 폼) */}
      {isCreateAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              새 과제 생성
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  과제명
                </label>
                <input
                  type="text"
                  placeholder="예: 스마트 컨트랙트 개발하기"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  placeholder="과제 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  트랙 선택
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="">트랙을 선택하세요</option>
                  {state.cohorts.map((cohort) => (
                    <option key={cohort.id} value={cohort.id}>
                      {cohort.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가중치 (%)
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    만점
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  마감일
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCreateAssignmentModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert("🎉 새 과제가 생성되었습니다!");
                  setIsCreateAssignmentModalOpen(false);
                }}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
