"use client";

import React, { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useConfig,
} from "wagmi";
import { formatUnits, keccak256, stringToBytes } from "viem";
import { waitForTransactionReceipt } from "wagmi/actions";
import {
  CONTRACTS,
  MOCK_TOKEN_ABI,
  DEPOSIT_ESCROW_ABI,
} from "../lib/contracts";
import { useApp } from "../contexts/AppContext";
import { SimpleDepositModal } from "./SimpleDepositModal";
import { TokenFaucet } from "./TokenFaucet";
import { ContractChecker } from "./ContractChecker";
import { AssignmentCard } from "./AssignmentCard";
import { AssignmentSubmissionModal } from "./AssignmentSubmissionModal";
import {
  Trophy,
  BookOpen,
  Award,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  Shield,
  Target,
} from "lucide-react";

interface StudentDashboardProps {
  address: string;
}

export function StudentDashboard({ address }: StudentDashboardProps) {
  const { address: connectedAddress } = useAccount();
  const { state, dispatch } = useApp();
  const cfg = useConfig();
  const { writeContractAsync } = useWriteContract();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  // 주소 불일치 체크
  console.log("🔍 주소 체크:", {
    propAddress: address,
    connectedAddress,
    isMatch: connectedAddress?.toLowerCase() === address.toLowerCase(),
    chainId: 11155111, // Sepolia
    contracts: CONTRACTS,
  });

  // 사용자 토큰 잔액 조회
  const { data: tokenBalance } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 2000,
    },
  });

  // 학생이 참여 중인 기수들
  const studentEnrollments = state.enrollments.filter(
    (e) => e.studentAddress === address
  );

  const enrolledCohorts = state.cohorts.filter((c) =>
    studentEnrollments.some((e) => e.cohortId === c.id)
  );

  // 현재 예치 상태 확인
  const { data: stakeData } = useReadContract({
    address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
    abi: DEPOSIT_ESCROW_ABI,
    functionName: "getStake",
    args: connectedAddress
      ? [keccak256(stringToBytes("Bay Research Track 2024")), connectedAddress]
      : undefined,
    query: { enabled: !!connectedAddress },
  });

  // 학생 통계
  const enrolledAssignments = state.assignments.filter((a) =>
    studentEnrollments.some((e) => e.cohortId === a.cohortId)
  );

  // 실제 블록체인 예치 상태 확인 (stakeData 사용)
  const hasRealDeposit =
    stakeData && stakeData[0] && stakeData[0] > BigInt(0) && !stakeData[1];

  const studentStats = {
    totalCohorts: enrolledCohorts.length,
    activeCohorts: enrolledCohorts.filter((c) => c.status === "active").length,
    completedAssignments: studentEnrollments.reduce(
      (sum, e) => sum + e.completedAssignments.length,
      0
    ),
    totalAssignments: enrolledAssignments.length,
    certificates: state.certificates.length,
    totalDeposits: hasRealDeposit ? 100 : 0, // 실제 블록체인 상태 기반
  };

  // 모든 과제 완료 여부 확인
  const allAssignmentsCompleted =
    studentStats.completedAssignments === studentStats.totalAssignments &&
    studentStats.totalAssignments > 0;

  // 중복 제거됨 - 위에서 이미 선언

  // 보증금 반환 함수
  const handleRefund = async () => {
    if (!connectedAddress) {
      alert("지갑을 연결해주세요.");
      return;
    }

    setIsRefunding(true);
    try {
      console.log("🏦 보증금 반환 시작");
      console.log("🔍 현재 stake 상태:", stakeData);

      // cohortId를 bytes32로 변환
      const cohortId = keccak256(stringToBytes("Bay Research Track 2024"));
      console.log("🔍 cohortId:", cohortId);

      // 예치 상태 확인
      if (stakeData) {
        const [amount, settled] = stakeData;
        console.log("🔍 예치 금액:", amount?.toString(), "반환 여부:", settled);

        if (settled) {
          alert("❌ 이미 반환된 보증금입니다.");
          return;
        }

        if (!amount || amount === BigInt(0)) {
          alert("❌ 예치된 보증금이 없습니다.");
          return;
        }
      }

      // DepositEscrow.selfRefund() 호출
      const refundHash = await writeContractAsync({
        address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
        abi: DEPOSIT_ESCROW_ABI,
        functionName: "selfRefund",
        args: [cohortId],
      } as any);

      console.log("✅ 보증금 반환 트랜잭션 제출됨:", refundHash);

      alert(
        `🎉 보증금 반환이 완료되었습니다!\n\n` +
          `💰 100 bUSD가 지갑으로 반환되었습니다\n` +
          `🔗 트랜잭션: ${refundHash}\n\n` +
          `축하합니다! 학습을 성공적으로 완료하셨습니다! 🎊`
      );

      // 토큰 잔액 새로고침
      setTimeout(() => {
        window.location.reload(); // 간단하게 페이지 새로고침
      }, 2000);
    } catch (error) {
      console.error("❌ 보증금 반환 실패:", error);
      alert(
        `❌ 보증금 반환에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 컨트랙트 설정 확인 */}
      <ContractChecker />

      {/* 토큰 팩셋 */}
      <TokenFaucet />

      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          안녕하세요! 👋
        </h1>
        <p className="text-lg text-gray-600">
          오늘도 열심히 학습해보세요. 현재{" "}
          <span className="font-semibold text-blue-600">
            {studentStats.activeCohorts}개
          </span>
          의 DAO 트랙에 참여 중입니다.
        </p>
      </div>

      {/* 학습 진행 단계 */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 text-blue-600 mr-2" />
          나의 학습 여정
        </h2>

        <div className="flex items-center justify-between">
          {/* 1단계: 기수 참여 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              DAO 트랙 참여
            </span>
            <span className="text-xs text-gray-500">
              {enrolledCohorts.length}개 참여
            </span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 2단계: 보증금 예치 */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                studentStats.totalDeposits > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {studentStats.totalDeposits > 0 ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              보증금 예치
            </span>
            <span className="text-xs text-gray-500">
              {studentStats.totalDeposits > 0 ? "예치 완료" : "예치 필요"}
            </span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 3단계: 과제 수행 */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                allAssignmentsCompleted
                  ? "bg-green-100 text-green-600"
                  : studentStats.completedAssignments > 0
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {allAssignmentsCompleted ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <BookOpen className="h-6 w-6" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              DAO 과제 수행
            </span>
            <span className="text-xs text-gray-500">
              {studentStats.completedAssignments}/
              {studentStats.totalAssignments} 완료
            </span>
            {studentStats.totalAssignments > 0 && (
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(studentStats.completedAssignments / studentStats.totalAssignments) * 100}%`,
                  }}
                ></div>
              </div>
            )}
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 4단계: 보증금 반환 */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                allAssignmentsCompleted
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {allAssignmentsCompleted ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Trophy className="h-6 w-6" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              보증금 반환
            </span>
            <span className="text-xs text-gray-500">
              {allAssignmentsCompleted ? "반환 가능" : "대기 중"}
            </span>
          </div>
        </div>
      </div>

      {/* 큰 액션 버튼 (조건부) */}
      {!hasRealDeposit ? (
        /* 예치하기 버튼 */
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">보증금 예치하기</h3>
          <p className="text-blue-100 mb-6">
            Bay Research Track 2024 참여를 위해 100 bUSD를 예치해주세요
          </p>
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
          >
            💰 100 bUSD 예치하기
          </button>
          <p className="text-xs text-blue-200 mt-3">
            모든 과제 완료 시 보증금 100% 반환
          </p>
        </div>
      ) : allAssignmentsCompleted ? (
        /* 보증금 반환 버튼 */
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Trophy className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">🎉 모든 과제 완료!</h3>
          <p className="text-green-100 mb-6">
            축하합니다! 모든 과제를 완료하여 보증금을 반환받을 수 있습니다
          </p>
          <button
            onClick={handleRefund}
            disabled={isRefunding}
            className="bg-white text-green-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefunding ? "반환 중..." : "💸 100 bUSD 반환받기"}
          </button>
          <p className="text-xs text-green-200 mt-3">
            보증금이 지갑으로 즉시 반환됩니다
          </p>
        </div>
      ) : (
        /* 보증금 예치 완료 상태 */
        <div className="bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl p-6 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">✅ 보증금 예치 완료</h3>
          <p className="text-gray-100 mb-6">
            보증금이 성공적으로 예치되었습니다. 이제 과제를 수행해보세요!
          </p>
          <div className="bg-white text-gray-600 font-semibold py-4 px-8 rounded-lg shadow-lg">
            💰 예치 완료 - 과제를 진행하세요
          </div>
          <p className="text-xs text-gray-200 mt-3">
            모든 과제 완료 시 보증금 100% 반환
          </p>
        </div>
      )}

      {/* 빠른 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {typeof tokenBalance === "bigint"
                  ? Number(formatUnits(tokenBalance, 18)).toFixed(2)
                  : "0.00"}
              </p>
              <p className="text-sm text-gray-600">bUSD 잔액</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {studentStats.completedAssignments}/
                {studentStats.totalAssignments}
              </p>
              <p className="text-sm text-gray-600">과제 완료</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {studentStats.totalCohorts}
              </p>
              <p className="text-sm text-gray-600">참여 기수</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {studentStats.certificates}
              </p>
              <p className="text-sm text-gray-600">획득 인증서</p>
            </div>
          </div>
        </div>
      </div>

      {/* 현재 기수 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          나의 DAO 트랙
        </h2>

        {enrolledCohorts.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 참여 중인 DAO 트랙이 없습니다
            </h3>
            <p className="text-gray-600">
              새로운 DAO 트랙에 참여하여 학습을 시작해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCohorts.map((cohort) => (
              <div
                key={cohort.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {cohort.name}
                </h3>
                <p className="text-gray-600 mb-4">{cohort.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>보증금: {cohort.depositAmount} bUSD</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {cohort.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 나의 DAO 과제 - 보증금 예치 후에만 표시 */}
      {hasRealDeposit ? (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            나의 DAO 과제
          </h2>

          {enrolledCohorts.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                DAO 과제가 없습니다
              </h3>
              <p className="text-gray-600">
                DAO 트랙에 참여하면 과제를 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledCohorts.map((cohort) => {
                const cohortAssignments = state.assignments.filter(
                  (a) => a.cohortId === cohort.id
                );
                const enrollment = studentEnrollments.find(
                  (e) => e.cohortId === cohort.id
                );

                return (
                  <div
                    key={cohort.id}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {cohort.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {cohort.track} 트랙
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {enrollment?.completedAssignments.length || 0}/
                          {cohortAssignments.length} 제출
                        </p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                cohortAssignments.length > 0
                                  ? ((enrollment?.completedAssignments.length ||
                                      0) /
                                      cohortAssignments.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {cohortAssignments.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p>아직 과제가 없습니다.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cohortAssignments.map((assignment) => {
                          const isSubmitted = enrollment
                            ? enrollment.completedAssignments.includes(
                                assignment.id
                              )
                            : false;
                          return (
                            <AssignmentCard
                              key={assignment.id}
                              assignment={assignment}
                              isSubmitted={isSubmitted}
                              maxScore={assignment.maxScore}
                              weight={assignment.weight}
                              cohortName={cohort.name}
                              onClick={() =>
                                console.log("과제 클릭:", assignment.id)
                              }
                              onSubmit={() => {
                                setSelectedAssignment(assignment);
                                setIsSubmissionModalOpen(true);
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* 보증금 예치 전 과제 안내 */
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            나의 DAO 과제
          </h2>
          <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-xl p-8 text-center">
            <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              보증금 예치 후 과제를 확인할 수 있습니다
            </h3>
            <p className="text-gray-600 mb-4">
              DAO 트랙에 보증금을 예치하면 과제를 확인하고 수행할 수 있습니다.
            </p>
            <p className="text-sm text-yellow-700">
              💡 위의 "보증금 예치하기" 버튼을 클릭해주세요
            </p>
          </div>
        </section>
      )}

      {/* 간단한 예치 모달 */}
      <SimpleDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        address={address}
        amount={100}
      />

      {/* 과제 제출 모달 */}
      <AssignmentSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => {
          setIsSubmissionModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignmentTitle={selectedAssignment?.title || ""}
        onSubmit={async (submission) => {
          console.log("과제 제출 데이터:", {
            assignment: selectedAssignment,
            submission,
          });

          // Context 상태 업데이트 (과제 제출 처리)
          if (selectedAssignment) {
            dispatch({
              type: "SUBMIT_ASSIGNMENT",
              payload: {
                studentAddress: address,
                assignmentId: selectedAssignment.id,
                cohortId: selectedAssignment.cohortId,
              },
            });

            alert(
              `✅ "${selectedAssignment.title}" 과제가 제출되었습니다!\n\n` +
                `📎 링크: ${submission.links.length}개\n` +
                `📁 파일: ${submission.files.length}개\n` +
                `📝 설명: ${submission.description ? "작성됨" : "없음"}\n\n` +
                `🎉 모든 과제 완료 시 보증금을 반환받을 수 있습니다!`
            );
          }
        }}
      />
    </div>
  );
}
