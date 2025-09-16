"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS, DEPOSIT_ESCROW_ABI } from "../lib/contracts";

export function ContractDebugger() {
  // DepositEscrow 컨트랙트의 토큰 주소 확인
  const { data: escrowTokenAddress } = useReadContract({
    address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "token",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "token",
  });

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-red-900 mb-2">🔍 컨트랙트 디버그</h3>
      <div className="text-sm space-y-1">
        <p>
          <strong>UI에서 사용하는 bUSD:</strong> {CONTRACTS.MOCK_TOKEN}
        </p>
        <p>
          <strong>DepositEscrow의 토큰:</strong>{" "}
          {escrowTokenAddress || "로딩 중..."}
        </p>
        <p>
          <strong>주소 일치:</strong>{" "}
          {escrowTokenAddress?.toLowerCase() ===
          CONTRACTS.MOCK_TOKEN.toLowerCase()
            ? "✅ 일치"
            : "❌ 불일치"}
        </p>
        <p>
          <strong>DepositEscrow 주소:</strong> {CONTRACTS.DEPOSIT_ESCROW}
        </p>
      </div>
    </div>
  );
}
