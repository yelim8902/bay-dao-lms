"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { Header } from "../components/Header";
import { UserRoleSelector } from "../components/UserRoleSelector";
import { StudentDashboard } from "../components/StudentDashboard";
import { AdminDashboard } from "../components/AdminDashboard";
import { useEffect, useState } from "react";
import { MOCK_TOKEN, DEPOSIT_ESCROW } from "../lib/contracts";
import { keccak256, toUtf8Bytes } from "ethers";

type UserRole = "student" | "instructor" | "admin" | "dao";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [isDepositing, setIsDepositing] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "track" | "deposit" | "dashboard"
  >("track");

  // 예치금 입금 함수
  const handleDeposit = async (cohortName: string, amount: number) => {
    if (!address) {
      alert("지갑을 연결해주세요.");
      return;
    }

    console.log("예치 시작:", { cohortName, amount, address });
    setIsDepositing(true);

    try {
      // 1단계: bUSD approve
      console.log("1단계: bUSD approve 시작");
      const approveTxHash = await writeContract({
        address: MOCK_TOKEN.address as `0x${string}`,
        abi: MOCK_TOKEN.abi,
        functionName: "approve",
        args: [
          DEPOSIT_ESCROW.address as `0x${string}`,
          BigInt(amount * 10 ** 18),
        ],
      } as any);

      console.log("Approve 트랜잭션 해시:", approveTxHash);

      // approve 트랜잭션 완료 대기
      if (approveTxHash !== undefined) {
        console.log("Approve 트랜잭션 제출됨, 완료 대기 중...");

        // approve 완료 대기 (더 긴 지연)
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log("Approve 완료, deposit 시작");

        // 2단계: 실제 예치
        // cohortName을 bytes32로 변환
        const cohortId = keccak256(toUtf8Bytes(cohortName));
        console.log("Cohort ID (bytes32):", cohortId);

        try {
          console.log("Deposit 컨트랙트 호출 시작:", {
            address: DEPOSIT_ESCROW.address,
            cohortId,
            amount: BigInt(amount * 10 ** 18).toString(),
          });

          const depositTxHash = await writeContract({
            address: DEPOSIT_ESCROW.address as `0x${string}`,
            abi: DEPOSIT_ESCROW.abi,
            functionName: "deposit",
            args: [cohortId, BigInt(amount * 10 ** 18)],
          } as any);

          console.log("Deposit 트랜잭션 해시:", depositTxHash);

          if (depositTxHash !== undefined) {
            console.log("Deposit 트랜잭션 제출됨, 완료 대기 중...");

            // deposit 완료 대기 (더 긴 지연)
            await new Promise((resolve) => setTimeout(resolve, 5000));

            console.log("예치 완료!");
            alert(`${cohortName}에 ${amount} bUSD 예치가 완료되었습니다!`);

            // 잔액 새로고침을 위한 지연
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            throw new Error("Deposit 트랜잭션 제출에 실패했습니다.");
          }
        } catch (depositError) {
          console.error("Deposit 트랜잭션 실패:", depositError);
          throw new Error(
            `Deposit 실패: ${depositError.message || depositError}`
          );
        }
      } else {
        throw new Error("Approve 트랜잭션 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("예치 실패:", error);
      alert(`예치에 실패했습니다: ${error.message || error}`);
    } finally {
      setIsDepositing(false);
    }
  };

  const { writeContract } = useWriteContract();

  // Hydration 에러 방지를 위한 마운트 상태 관리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 지갑 연결 상태 변경 시 상태 초기화
  useEffect(() => {
    if (!isConnected) {
      // 지갑 연결 해제 시 모든 상태 초기화
      setCurrentStep("track");
      setSelectedTrack(null);
      setUserRole("student");
      setIsDepositing(false);
    }
  }, [isConnected]);

  // Hydration 에러 방지
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bay LMS에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              보증금으로 학습을 보장하는 탈중앙화 학습 관리 시스템
            </p>
            <div className="animate-pulse bg-gray-200 h-10 w-32 mx-auto rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  // 디버깅을 위한 로그 추가
  console.log("Wallet connection status:", { address, isConnected, mounted });

  const renderDashboard = () => {
    switch (userRole) {
      case "student":
        return isConnected && address ? (
          <StudentDashboard address={address} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              학생 대시보드
            </h2>
            <p className="text-gray-600">지갑을 연결해주세요.</p>
          </div>
        );
      case "instructor":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              강사 대시보드
            </h2>
            <p className="text-gray-600">강사 기능은 준비 중입니다.</p>
          </div>
        );
      case "admin":
        return isConnected && address ? (
          <AdminDashboard address={address} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              관리자 대시보드
            </h2>
            <p className="text-gray-600">지갑을 연결해주세요.</p>
          </div>
        );
      case "dao":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              DAO 대시보드
            </h2>
            <p className="text-gray-600">DAO 기능은 준비 중입니다.</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">대시보드</h2>
            <p className="text-gray-600">역할을 선택해주세요.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-4xl mx-auto">
            {/* 히어로 섹션 */}
            <div className="text-center py-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Bay DAO에서
                <br />
                <span className="text-blue-600">학습하고 성장하세요</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                보증금으로 학습을 보장하는 탈중앙화 학습 관리 시스템.
                <br />
                과제를 완료하면 보증금을 돌려받고, 실패하면 DAO에 기여하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ConnectButton />
                <button className="btn-secondary">더 알아보기</button>
              </div>
            </div>

            {/* 학습 과정 안내 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  DAO 트랙 참여
                </h3>
                <p className="text-gray-600 text-sm">
                  원하는 학습 트랙의 DAO에 참여하세요
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  보증금 예치
                </h3>
                <p className="text-gray-600 text-sm">
                  학습 보장을 위한 보증금을 예치하세요
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  과제 수행
                </h3>
                <p className="text-gray-600 text-sm">
                  제공된 과제들을 완료하세요
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  보증금 반환
                </h3>
                <p className="text-gray-600 text-sm">
                  모든 과제 완료 시 보증금을 돌려받으세요
                </p>
              </div>
            </div>

            {/* 현재 진행 중인 기수들 */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                현재 진행 중인 DAO 트랙
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Bay Research Track 2024
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      진행중
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    블록체인 연구를 위한 심화 과정
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>보증금: 100 bUSD</span>
                    <span>참여자: 15/20명</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Bay Development Track 2024
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      모집중
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">실무 중심의 개발 과정</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>보증금: 150 bUSD</span>
                    <span>참여자: 8/25명</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DAO 통계 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Bay DAO 현황
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">$5,000</p>
                  <p className="text-gray-600">총 예치금</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">25명</p>
                  <p className="text-gray-600">참여자</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">85%</p>
                  <p className="text-gray-600">성공률</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">2개</p>
                  <p className="text-gray-600">활성 DAO 트랙</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {currentStep === "track" && (
              <>
                {/* 나의 학습 여정 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    나의 학습 여정 📚
                  </h2>
                  <p className="text-gray-600 mb-6">
                    지갑이 연결되었습니다! 이제 DAO 트랙에 참여하고 학습을
                    시작해보세요.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-blue-600">
                          1
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        DAO 트랙 선택
                      </h3>
                      <p className="text-xs text-gray-600">
                        원하는 학습 트랙 선택
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-purple-600">
                          2
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        보증금 예치
                      </h3>
                      <p className="text-xs text-gray-600">
                        학습 보장을 위한 예치
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-green-600">
                          3
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        과제 수행
                      </h3>
                      <p className="text-xs text-gray-600">
                        제공된 과제들 완료
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg font-bold text-yellow-600">
                          4
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        보증금 반환
                      </h3>
                      <p className="text-xs text-gray-600">
                        완료 시 보증금 반환
                      </p>
                    </div>
                  </div>
                </div>

                {/* DAO 트랙 선택 */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    참여할 DAO 트랙을 선택하세요
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Bay Research Track 2024
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          모집중
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        블록체인 연구를 위한 심화 과정
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>보증금: 100 bUSD</span>
                        <span>참여자: 15/20명</span>
                      </div>
                      <button
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setSelectedTrack("Bay Research Track 2024");
                          setUserRole("student");
                          setCurrentStep("deposit");
                        }}
                        disabled={isDepositing}
                      >
                        {isDepositing ? "예치 중..." : "참여하기"}
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Bay Development Track 2024
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          모집중
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        실무 중심의 개발 과정
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>보증금: 150 bUSD</span>
                        <span>참여자: 8/25명</span>
                      </div>
                      <button
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setSelectedTrack("Bay Development Track 2024");
                          setUserRole("student");
                          setCurrentStep("deposit");
                        }}
                        disabled={isDepositing}
                      >
                        {isDepositing ? "예치 중..." : "참여하기"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === "deposit" && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🎯 DAO 트랙 참여 준비
                  </h2>
                  <p className="text-gray-700 mb-6">
                    <strong>{selectedTrack}</strong>에 student 역할로
                    참여합니다.
                  </p>

                  <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      보증금 안내
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      학습 완료를 보장하기 위해 보증금을 예치합니다.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 text-left">
                      <li>• 모든 과제 완료 시 보증금 100% 반환</li>
                      <li>• 과제 미완료 시 보증금 일부 차감</li>
                      <li>• 학습 동기 부여 및 DAO 운영 지원</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      역할 선택:
                    </label>
                    <UserRoleSelector
                      onRoleChange={(role) => setUserRole(role as UserRole)}
                      currentRole={
                        userRole as "student" | "instructor" | "admin"
                      }
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCurrentStep("track")}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200"
                    >
                      뒤로 가기
                    </button>
                    <button
                      onClick={() => setCurrentStep("dashboard")}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
                    >
                      {userRole === "admin" ? "관리자로 시작" : "참여하기"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "dashboard" && (
              <>
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6">
                  <p className="text-center text-gray-700">
                    <strong>{selectedTrack}</strong>에{" "}
                    <strong>{userRole}</strong> 역할로 참여 중입니다.
                  </p>
                </div>
                {renderDashboard()}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
