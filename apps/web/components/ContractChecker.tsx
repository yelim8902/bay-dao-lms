"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "../lib/contracts";

export function ContractChecker() {
  // DepositEscrow의 token 주소 읽기
  const { data: tokenAddress, error } = useReadContract({
    address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "token",
        outputs: [
          { internalType: "contract IERC20", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "token",
  });

  // DepositEscrow의 verifier 주소 읽기
  const { data: verifierAddress } = useReadContract({
    address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "verifier",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "verifier",
  });

  // DepositEscrow의 treasury 주소 읽기
  const { data: treasuryAddress } = useReadContract({
    address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: "treasury",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "treasury",
  });

  const isCorrectToken =
    tokenAddress?.toLowerCase() === CONTRACTS.MOCK_TOKEN.toLowerCase();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-900 mb-3">
        🔍 DepositEscrow 컨트랙트 설정 확인
      </h3>
      <div className="text-sm space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>예상 bUSD 주소:</strong>
            </p>
            <p className="font-mono text-xs break-all text-gray-600">
              {CONTRACTS.MOCK_TOKEN}
            </p>
          </div>
          <div>
            <p>
              <strong>실제 토큰 주소:</strong>
            </p>
            <p className="font-mono text-xs break-all text-gray-600">
              {tokenAddress || "로딩 중..."}
            </p>
          </div>
        </div>

        <div
          className={`p-2 rounded ${isCorrectToken ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          <strong>토큰 주소 일치:</strong>{" "}
          {isCorrectToken ? "✅ 일치" : "❌ 불일치"}
        </div>

        {!isCorrectToken && tokenAddress && (
          <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-yellow-800 text-xs">
            <strong>⚠️ 문제:</strong> DepositEscrow가 다른 토큰을 사용하도록
            배포되었습니다.
            <br />
            올바른 bUSD 주소로 재배포가 필요합니다.
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Verifier:</strong> {verifierAddress || "로딩 중..."}
          </p>
          <p>
            <strong>Treasury:</strong> {treasuryAddress || "로딩 중..."}
          </p>
          <p>
            <strong>DepositEscrow:</strong> {CONTRACTS.DEPOSIT_ESCROW}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 rounded p-2 text-red-800 text-xs">
            <strong>에러:</strong> {error.message}
            <br />
            <strong>해결책:</strong> DepositEscrow 컨트랙트를 올바른 bUSD 주소로
            재배포하거나, Etherscan에서 Contract 탭 → "Verify and Publish" 클릭
          </div>
        )}

        <div className="bg-gray-100 rounded p-2 text-xs">
          <strong>💡 확인 방법:</strong>
          <br />
          1. Etherscan → DepositEscrow 주소 → Contract 탭
          <br />
          2. "Verify and Publish" 또는 "Read Contract" 확인
          <br />
          3. Constructor에서 사용한 토큰 주소 확인
        </div>
      </div>
    </div>
  );
}
