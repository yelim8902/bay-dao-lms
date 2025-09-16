"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import {
  CONTRACTS,
  MOCK_TOKEN_ABI,
  DEPOSIT_ESCROW_ABI,
} from "../lib/contracts";
import {
  keccak256,
  stringToBytes,
  parseUnits,
  formatUnits,
  isAddress as isViemAddress,
  type Hex,
} from "viem";

interface SimpleDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string; // 예상 예치자 주소(=연결 지갑이어야 함)
  amount: number; // 표시용(예: 100)
}

export function SimpleDepositModal({
  isOpen,
  onClose,
  address,
  amount,
}: SimpleDepositModalProps) {
  const cfg = useConfig();
  const { address: connected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isDepositing, setIsDepositing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 1) 토큰 decimals 읽기 (가정 말고 실제 읽기)
  const { data: decimalsData } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: "decimals",
    query: { enabled: !!CONTRACTS.MOCK_TOKEN },
  });

  const decimals = typeof decimalsData === "number" ? decimalsData : 18;

  // 2) allowance 읽기 (있으면 approve 생략 가능)
  const { data: allowance } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: "allowance",
    args:
      isViemAddress(address) && isViemAddress(CONTRACTS.DEPOSIT_ESCROW)
        ? [address as `0x${string}`, CONTRACTS.DEPOSIT_ESCROW as `0x${string}`]
        : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.DEPOSIT_ESCROW,
      refetchInterval: 4000,
    },
  });

  const cohortId = useMemo<Hex>(() => {
    // 컨트랙트가 bytes32를 받는다고 가정
    return keccak256(stringToBytes("Bay Research Track 2024"));
  }, []);

  const weiAmount = useMemo(
    () => parseUnits(String(amount), decimals),
    [amount, decimals]
  );

  const handleDeposit = async () => {
    setErr(null);

    // 0) 연결 주소 검증
    if (!connected) {
      alert("지갑을 연결해주세요.");
      return;
    }
    if (connected.toLowerCase() !== address.toLowerCase()) {
      alert(
        "연결된 지갑 주소와 예치 대상 주소가 다릅니다. 올바른 계정으로 연결해주세요."
      );
      return;
    }

    setIsDepositing(true);
    try {
      // 3) allowance 확인 → 부족하면 approve 먼저
      const hasAllowance =
        typeof allowance === "bigint" ? allowance >= weiAmount : false;

      if (!hasAllowance) {
        const approveHash = await writeContractAsync({
          address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
          abi: MOCK_TOKEN_ABI,
          functionName: "approve",
          args: [CONTRACTS.DEPOSIT_ESCROW as `0x${string}`, weiAmount],
        } as any);
        // 영수증 대기 (채굴 완료 보장)
        await waitForTransactionReceipt(cfg, { hash: approveHash });
      }

      // 4) deposit 실행 (시그니처 정확히 확인!)
      const depositHash = await writeContractAsync({
        address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
        abi: DEPOSIT_ESCROW_ABI,
        functionName: "deposit", // 예: deposit(bytes32 cohortId, uint256 amount)
        args: [cohortId, weiAmount],
      } as any);
      await waitForTransactionReceipt(cfg, { hash: depositHash });

      alert(`✅ ${amount} bUSD 예치 완료! 이제 과제를 확인해보세요!`);

      // 페이지 새로고침으로 상태 업데이트
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      onClose();
    } catch (e: any) {
      console.error(e);
      setErr(e?.shortMessage ?? e?.message ?? "트랜잭션 실패");
      alert("❌ 예치 실패");
    } finally {
      setIsDepositing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">보증금 예치</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p>Bay Research Track 2024에 {amount} bUSD를 예치하시겠습니까?</p>
          {!!err && <p className="text-red-600 text-sm">{err}</p>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg"
            >
              취소
            </button>
            <button
              onClick={handleDeposit}
              disabled={isDepositing}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg disabled:opacity-50"
            >
              {isDepositing ? "예치 중..." : `${amount} bUSD 예치`}
            </button>
          </div>

          {/* (선택) 디버그 표시 */}
          <p className="text-xs text-gray-500">
            decimals: {decimals}, wei: {formatUnits(weiAmount, 18)}e18 기준
          </p>
        </div>
      </div>
    </div>
  );
}
