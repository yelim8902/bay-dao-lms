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
import { CertificateModal } from "./CertificateModal";
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

  // 데모 모드 상태
  const [demoMode, setDemoMode] = useState(false);
  const [demoHasDeposit, setDemoHasDeposit] = useState(false);
  const [demoCompletedAssignments, setDemoCompletedAssignments] = useState<
    number[]
  >([]);

  // 개발자 도구 토글
  const [showDevTools, setShowDevTools] = useState(false);

  // 인증서 모달 상태
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // 데모 모드 인증서 상태
  const [demoHasCertificate, setDemoHasCertificate] = useState(false);

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

  console.log("🔍 Enrollment 디버깅:", {
    address,
    allEnrollments: state.enrollments,
    studentEnrollments,
    enrolledCohorts,
    allCohorts: state.cohorts,
  });

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
  console.log("🔍 stakeData 디버깅:", {
    stakeData,
    hasAmount: stakeData && stakeData[0] && stakeData[0] > BigInt(0),
    isNotSettled: stakeData && !stakeData[1],
    fullCheck:
      stakeData && stakeData[0] && stakeData[0] > BigInt(0) && !stakeData[1],
  });

  // 보증금이 있으면 과제를 보여줌 (settled 상태와 관계없이)
  const hasRealDeposit = demoMode
    ? demoHasDeposit
    : stakeData && stakeData[0] && stakeData[0] > BigInt(0);

  // 보증금이 있지만 enrollment가 없는 경우 자동으로 생성
  React.useEffect(() => {
    if (hasRealDeposit && studentEnrollments.length === 0 && !demoMode) {
      console.log("🔄 자동 enrollment 생성 중...");
      dispatch({
        type: "ENROLL_STUDENT",
        payload: {
          studentAddress: address,
          cohortId: "Bay Research Track 2024",
          enrolledAt: new Date().toISOString(),
          completedAssignments: [],
          certificates: [],
        },
      });
    }
  }, [hasRealDeposit, studentEnrollments.length, address, dispatch, demoMode]);

  const studentStats = {
    totalCohorts: enrolledCohorts.length,
    activeCohorts: enrolledCohorts.filter((c) => c.status === "active").length,
    completedAssignments: demoMode
      ? demoCompletedAssignments.length
      : studentEnrollments.reduce(
          (sum, e) => sum + e.completedAssignments.length,
          0
        ),
    totalAssignments: demoMode ? 2 : enrolledAssignments.length,
    certificates: demoMode
      ? demoHasCertificate
        ? 1
        : 0
      : state.certificates.length,
    totalDeposits: hasRealDeposit ? 100 : 0, // 실제 블록체인 상태 기반
  };

  // 모든 과제 완료 여부 확인
  const allAssignmentsCompleted = demoMode
    ? demoCompletedAssignments.length === 2
    : studentStats.completedAssignments === studentStats.totalAssignments &&
      studentStats.totalAssignments > 0;

  console.log("🔍 과제 완료 상태 디버깅:", {
    demoMode,
    demoCompletedAssignments,
    allAssignmentsCompleted,
    demoHasDeposit,
    showRefundButton: demoMode
      ? demoHasDeposit && allAssignmentsCompleted
      : false,
  });

  // 반환 가능 여부 (보증금이 있고 아직 settled되지 않았을 때)
  const canRefund = demoMode
    ? demoHasDeposit && allAssignmentsCompleted // 데모: 예치 + 과제 완료 시 반환 가능
    : stakeData && stakeData[0] && stakeData[0] > BigInt(0) && !stakeData[1];

  // 반환 완료 여부 확인
  const isRefunded = demoMode
    ? false // 데모에서는 반환 후 리셋되므로 항상 false
    : stakeData && stakeData[0] && stakeData[0] > BigInt(0) && stakeData[1]; // settled: true

  // 데모용: 강제로 반환 버튼 보이기 (과제 완료 시)
  const showRefundButton = demoMode
    ? demoHasDeposit && allAssignmentsCompleted
    : allAssignmentsCompleted &&
      (canRefund || (stakeData && stakeData[0] && stakeData[0] > BigInt(0)));

  // 중복 제거됨 - 위에서 이미 선언

  // 보증금 반환 함수
  const handleRefund = async () => {
    if (!connectedAddress && !demoMode) {
      alert("지갑을 연결해주세요.");
      return;
    }

    setIsRefunding(true);
    try {
      if (demoMode) {
        // 데모 모드: 간단한 시뮬레이션
        console.log("🎬 데모 모드 보증금 반환 시작");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
        alert(
          `🎉 데모 모드: 보증금 반환이 완료되었습니다!\n\n` +
            `💰 100 bUSD가 지갑으로 반환되었습니다\n` +
            `🎊 축하합니다! 학습을 성공적으로 완료하셨습니다!`
        );
        // 인증서 표시 후 데모 상태 리셋
        setTimeout(() => {
          setDemoHasCertificate(true); // 인증서 발급
          setIsCertificateModalOpen(true);
        }, 500);
        setTimeout(() => {
          setDemoHasDeposit(false);
          setDemoCompletedAssignments([]);
          setDemoHasCertificate(false); // 인증서도 리셋
        }, 3000);
        return;
      }

      // 실제 블록체인 모드
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
      {/* 개발자 도구 토글 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <button
          onClick={() => setShowDevTools(!showDevTools)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-700">
            🛠️ 개발자 도구
          </span>
          <span className="text-xs text-gray-500">
            {showDevTools ? "숨기기" : "보기"}
          </span>
        </button>

        {showDevTools && (
          <div className="mt-4 space-y-4">
            {/* 컨트랙트 설정 확인 */}
            <ContractChecker />
            {/* 토큰 팩셋 */}
            <TokenFaucet />
          </div>
        )}
      </div>

      {/* 데모 컨트롤 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-yellow-800">🎬 데모 모드</h3>
            <p className="text-sm text-yellow-600">
              {demoMode ? "데모 모드 활성화" : "실제 블록체인 연동"}
            </p>
          </div>
          <button
            onClick={() => {
              const newDemoMode = !demoMode;
              setDemoMode(newDemoMode);
              if (newDemoMode) {
                // 데모 모드 켤 때 enrollment 자동 생성
                dispatch({
                  type: "ENROLL_STUDENT",
                  payload: {
                    studentAddress: address,
                    cohortId: "Bay Research Track 2024",
                    enrolledAt: new Date().toISOString(),
                    completedAssignments: [],
                    certificates: [],
                  },
                });
                setDemoHasDeposit(false);
                setDemoCompletedAssignments([]);
                setDemoHasCertificate(false);
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              demoMode
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {demoMode ? "✅ 데모 모드" : "🔄 데모 모드 켜기"}
          </button>
        </div>

        {demoMode && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                const newDepositStatus = !demoHasDeposit;
                setDemoHasDeposit(newDepositStatus);

                // 보증금 예치 시 enrollment 확인 및 생성
                if (newDepositStatus && studentEnrollments.length === 0) {
                  dispatch({
                    type: "ENROLL_STUDENT",
                    payload: {
                      studentAddress: address,
                      cohortId: "Bay Research Track 2024",
                      enrolledAt: new Date().toISOString(),
                      completedAssignments: [],
                      certificates: [],
                    },
                  });
                }
              }}
              className={`px-3 py-1 rounded text-sm ${
                demoHasDeposit
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              💰 {demoHasDeposit ? "예치 완료" : "예치하기"}
            </button>
            <button
              onClick={() => {
                const assignmentId = 1;
                setDemoCompletedAssignments((prev) =>
                  prev.includes(assignmentId)
                    ? prev.filter((id) => id !== assignmentId)
                    : [...prev, assignmentId]
                );
              }}
              className={`px-3 py-1 rounded text-sm ${
                demoCompletedAssignments.includes(1)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              📝 과제1{" "}
              {demoCompletedAssignments.includes(1) ? "완료" : "미완료"}
            </button>
            <button
              onClick={() => {
                const assignmentId = 2;
                setDemoCompletedAssignments((prev) =>
                  prev.includes(assignmentId)
                    ? prev.filter((id) => id !== assignmentId)
                    : [...prev, assignmentId]
                );
              }}
              className={`px-3 py-1 rounded text-sm ${
                demoCompletedAssignments.includes(2)
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              📝 과제2{" "}
              {demoCompletedAssignments.includes(2) ? "완료" : "미완료"}
            </button>
          </div>
        )}
      </div>

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
                hasRealDeposit
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {hasRealDeposit ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <span
              className={`text-sm font-medium ${hasRealDeposit ? "text-green-700" : "text-gray-700"}`}
            >
              보증금 예치
            </span>
            <span
              className={`text-xs ${hasRealDeposit ? "text-green-600" : "text-gray-500"}`}
            >
              {hasRealDeposit ? "✅ 예치 완료" : "예치 필요"}
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
            <span
              className={`text-sm font-medium ${allAssignmentsCompleted ? "text-green-700" : "text-gray-700"}`}
            >
              DAO 과제 수행
            </span>
            <span
              className={`text-xs ${allAssignmentsCompleted ? "text-green-600" : "text-gray-500"}`}
            >
              {allAssignmentsCompleted
                ? "✅ 모두 완료"
                : `${studentStats.completedAssignments}/${studentStats.totalAssignments} 완료`}
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
            <span
              className={`text-sm font-medium ${allAssignmentsCompleted ? "text-green-700" : "text-gray-700"}`}
            >
              보증금 반환
            </span>
            <span
              className={`text-xs ${allAssignmentsCompleted ? "text-green-600" : "text-gray-500"}`}
            >
              {allAssignmentsCompleted ? "✅ 반환 가능" : "대기 중"}
            </span>
          </div>

          <ArrowRight className="h-5 w-5 text-gray-400" />

          {/* 5단계: 인증서 발급 */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                allAssignmentsCompleted
                  ? "bg-yellow-100 text-yellow-600 cursor-pointer hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-400"
              }`}
              onClick={() => {
                if (allAssignmentsCompleted) {
                  setIsCertificateModalOpen(true);
                }
              }}
            >
              <Award className="h-6 w-6" />
            </div>
            <span
              className={`text-sm font-medium ${allAssignmentsCompleted ? "text-yellow-700" : "text-gray-700"}`}
            >
              인증서 발급
            </span>
            <span
              className={`text-xs ${allAssignmentsCompleted ? "text-yellow-600" : "text-gray-500"}`}
            >
              {allAssignmentsCompleted ? "🏆 클릭하여 확인" : "대기 중"}
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
          <h3 className="text-2xl font-bold mb-2">
            {hasRealDeposit ? "✅ 보증금 예치 완료" : "보증금 예치하기"}
          </h3>
          <p className="text-blue-100 mb-6">
            {hasRealDeposit
              ? "Bay Research Track 2024에 성공적으로 참여하였습니다! 아래에서 과제를 확인하세요."
              : "Bay Research Track 2024 참여를 위해 100 bUSD를 예치해주세요"}
          </p>
          <button
            onClick={() => {
              if (demoMode) {
                setDemoHasDeposit(true);
                alert(
                  "🎉 데모 모드: 100 bUSD 예치가 완료되었습니다!\n\n이제 DAO 과제를 확인할 수 있습니다! 📚"
                );
              } else {
                setIsDepositModalOpen(true);
              }
            }}
            className={`font-semibold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg ${
              hasRealDeposit
                ? "bg-green-500 text-white cursor-default"
                : "bg-white text-blue-600 hover:bg-gray-50"
            }`}
            disabled={hasRealDeposit}
          >
            {hasRealDeposit ? "✅ 예치 완료" : "💰 100 bUSD 예치하기"}
          </button>
          <p className="text-xs text-blue-200 mt-3">
            모든 과제 완료 시 보증금 100% 반환
          </p>
        </div>
      ) : isRefunded ? (
        /* 반환 완료 상태 */
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">🎊 학습 완료!</h3>
          <p className="text-green-100 mb-6">
            모든 과제를 완료하고 보증금을 성공적으로 반환받았습니다
          </p>
          <div className="bg-white text-green-600 font-semibold py-4 px-8 rounded-lg shadow-lg cursor-default">
            ✅ 반환 완료되었습니다
          </div>
          <p className="text-xs text-green-200 mt-3">
            축하합니다! Bay DAO 학습 과정을 성공적으로 완료하셨습니다
          </p>
        </div>
      ) : showRefundButton ? (
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
      {hasRealDeposit || studentEnrollments.length > 0 ? (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            나의 DAO 과제
          </h2>

          {/* 보증금이 있으면 Bay Research Track 과제들을 항상 보여줌 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Bay Research Track 2024
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  진행중
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>진행률</span>
                  <span>
                    {studentStats.completedAssignments}/
                    {
                      state.assignments.filter(
                        (a) => a.cohortId === "Bay Research Track 2024"
                      ).length
                    }
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        state.assignments.filter(
                          (a) => a.cohortId === "Bay Research Track 2024"
                        ).length > 0
                          ? (studentStats.completedAssignments /
                              state.assignments.filter(
                                (a) => a.cohortId === "Bay Research Track 2024"
                              ).length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.assignments
                  .filter((a) => a.cohortId === "Bay Research Track 2024")
                  .map((assignment) => {
                    const isSubmitted = demoMode
                      ? demoCompletedAssignments.includes(assignment.id)
                      : studentEnrollments.some((enrollment) =>
                          enrollment.completedAssignments.includes(
                            assignment.id
                          )
                        );
                    return (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        isSubmitted={isSubmitted}
                        maxScore={assignment.maxScore}
                        weight={assignment.weight}
                        cohortName="Bay Research Track 2024"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsSubmissionModalOpen(true);
                        }}
                        onSubmit={() => {
                          setSelectedAssignment(assignment);
                          setIsSubmissionModalOpen(true);
                        }}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              보증금을 예치해주세요
            </h3>
            <p className="text-gray-600">
              DAO 과제를 확인하려면 먼저 보증금을 예치해야 합니다.
            </p>
          </div>
        </section>
      )}

      {/* 이전 enrollment 기반 코드는 제거 */}
      {/* 이전 코드 주석처리 */}
      {false && (
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
            // 데모 모드에서는 demoCompletedAssignments 업데이트
            if (demoMode) {
              setDemoCompletedAssignments((prev) =>
                prev.includes(selectedAssignment.id)
                  ? prev
                  : [...prev, selectedAssignment.id]
              );
            } else {
              dispatch({
                type: "SUBMIT_ASSIGNMENT",
                payload: {
                  studentAddress: address,
                  assignmentId: selectedAssignment.id,
                  cohortId: selectedAssignment.cohortId,
                },
              });
            }

            // 과제 제출 완료 알림
            alert(
              `✅ "${selectedAssignment.title}" 과제가 제출되었습니다!\n\n` +
                `📎 링크: ${submission.links.length}개\n` +
                `📁 파일: ${submission.files.length}개\n` +
                `📝 설명: ${submission.description ? "작성됨" : "없음"}`
            );

            // 모든 과제 완료 시 인증서 표시
            const newCompletedCount = demoMode
              ? demoCompletedAssignments.includes(selectedAssignment.id)
                ? demoCompletedAssignments.length
                : demoCompletedAssignments.length + 1
              : studentStats.completedAssignments + 1;

            const totalAssignments = demoMode
              ? 2
              : studentStats.totalAssignments;

            if (
              newCompletedCount === totalAssignments &&
              totalAssignments > 0
            ) {
              setTimeout(() => {
                // 데모 모드에서 인증서 상태 업데이트
                if (demoMode) {
                  setDemoHasCertificate(true);
                } else {
                  // 실제 모드에서 인증서 생성
                  dispatch({
                    type: "GENERATE_CERTIFICATE",
                    payload: {
                      studentAddress: address,
                      cohortId: "Bay Research Track 2024",
                    },
                  });
                }

                alert(
                  "🎊 축하합니다! 모든 과제를 완료하셨습니다!\n\n🏆 인증서를 확인해보세요!"
                );
                setIsCertificateModalOpen(true);
              }, 1000);
            }
          }
        }}
      />

      {/* 인증서 모달 */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        studentName="Bay DAO Student"
        courseName="Bay Research Track 2024"
        completionDate={new Date().toLocaleDateString("ko-KR")}
        walletAddress={address}
      />
    </div>
  );
}
