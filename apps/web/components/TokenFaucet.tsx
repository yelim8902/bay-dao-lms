"use client";

import React, { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { DollarSign } from "lucide-react";
import { CONTRACTS, MOCK_TOKEN_ABI } from "../lib/contracts";

export function TokenFaucet() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!address) {
      alert("지갑을 연결해주세요.");
      return;
    }

    setIsMinting(true);
    try {
      const amount = parseUnits("1000", 18); // 1000 bUSD 발행

      await writeContractAsync({
        address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: "mint",
        args: [address, amount],
      } as any);

      alert("✅ 1000 bUSD 토큰을 받았습니다!");
    } catch (error) {
      console.error("토큰 발행 실패:", error);
      alert("❌ 토큰 발행에 실패했습니다.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 text-yellow-600 mr-2" />
            bUSD 토큰 받기
          </h3>
          <p className="text-sm text-gray-600">
            테스트용 bUSD 토큰을 받아보세요
          </p>
        </div>
        <button
          onClick={handleMint}
          disabled={isMinting || !address}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
        >
          {isMinting ? "발행 중..." : "1000 bUSD 받기"}
        </button>
      </div>
    </div>
  );
}
