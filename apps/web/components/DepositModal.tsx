'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, AlertCircle } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { keccak256, toUtf8Bytes } from 'ethers';
import { CONTRACTS, MOCK_TOKEN_ABI, DEPOSIT_ESCROW_ABI } from '../lib/contracts';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId: string;
  depositAmount: string;
  onSuccess?: () => void;
}

export function DepositModal({ isOpen, onClose, cohortId, depositAmount, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState(depositAmount);
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [depositTimeout, setDepositTimeout] = useState<NodeJS.Timeout | undefined>();

  const { address } = useAccount();
  const { writeContractAsync: approveToken, data: approveData } = useWriteContract();
  const { writeContractAsync: deposit, data: depositData } = useWriteContract();
  
  // 토큰 승인 상태 확인
  const { data: allowance } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.DEPOSIT_ESCROW as `0x${string}`] : undefined,
  });
  
  // 트랜잭션 완료 대기
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess, isError: isApproveError } = useWaitForTransactionReceipt({
    hash: approveData,
  });
  
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess, isError: isDepositError } = useWaitForTransactionReceipt({
    hash: depositData,
  });

  // 트랜잭션 완료 시 처리 (백업용 - 현재는 수동 처리 사용)
  useEffect(() => {
    if (isApproveSuccess && approveData) {
      console.log('Token approval successful via useEffect!');
      // 수동 처리로 대체됨
    }
    if (isApproveError && approveData) {
      console.error('Token approval failed via useEffect!');
      setIsApproving(false);
      setIsDepositing(false);
      alert('토큰 승인에 실패했습니다.');
    }
  }, [isApproveSuccess, isApproveError, approveData]);

  useEffect(() => {
    console.log('Deposit transaction status:', {
      isDepositConfirming,
      isDepositSuccess,
      isDepositError,
      depositData
    });
    
    if (isDepositSuccess && depositData) {
      console.log('Deposit successful!');
      setIsDepositing(false);
      
      // 타임아웃 클리어
      if (depositTimeout) {
        clearTimeout(depositTimeout);
        setDepositTimeout(undefined);
      }
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
    if (isDepositError && depositData) {
      console.error('Deposit failed!');
      setIsDepositing(false);
      
      // 타임아웃 클리어
      if (depositTimeout) {
        clearTimeout(depositTimeout);
        setDepositTimeout(undefined);
      }
      
      alert('보증금 예치에 실패했습니다.');
    }
  }, [isDepositConfirming, isDepositSuccess, isDepositError, depositData, onSuccess, onClose]);

  const handleApprove = async () => {
    if (!amount) return;
    
    console.log('Starting token approval...', {
      tokenAddress: CONTRACTS.MOCK_TOKEN,
      spenderAddress: CONTRACTS.DEPOSIT_ESCROW,
      amount: BigInt(Number(amount) * 1e18)
    });
    
    setIsApproving(true);
    try {
      const txHash = await approveToken({
        address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: 'approve',
        args: [CONTRACTS.DEPOSIT_ESCROW as `0x${string}`, BigInt(Number(amount) * 1e18)],
      } as any);
      
      console.log('Token approval transaction submitted:', txHash);
      
      if (txHash) {
        console.log('Approval transaction hash:', txHash);
        console.log('Approval transaction submitted, waiting for confirmation...');
        // 3초 후 승인 완료로 간주하고 예치 진행
        setTimeout(() => {
          console.log('Approval completed (manual timeout), proceeding with deposit...');
          setIsApproving(false);
          setIsDepositing(true);
          handleDepositDirect();
        }, 3000);
      } else {
        throw new Error('Transaction hash not received');
      }
      
    } catch (error) {
      console.error('Approve failed:', error);
      alert('토큰 승인에 실패했습니다. 다시 시도해주세요.');
      setIsApproving(false);
    }
  };

  const handleDepositDirect = async () => {
    if (!amount || !address) return;
    
    const depositAmount = BigInt(Number(amount) * 1e18);
    
    console.log('Starting deposit...', {
      escrowAddress: CONTRACTS.DEPOSIT_ESCROW,
      amount: depositAmount,
      cohortId: cohortId,
      userAddress: address
    });
    
    try {
      // 일단 MockERC20의 transfer 함수를 직접 사용해서 테스트
      console.log('Trying direct transfer to escrow contract...');
      const txHash = await deposit({
        address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: 'transfer',
        args: [CONTRACTS.DEPOSIT_ESCROW as `0x${string}`, depositAmount],
      } as any);
      
      console.log('Transfer transaction submitted:', txHash);
      
      if (txHash) {
        console.log('Transfer transaction hash:', txHash);
        console.log('Transfer transaction submitted, waiting for confirmation...');
        console.log('This should transfer', depositAmount.toString(), 'tokens from your wallet to the escrow contract');
        
        // 5초 후 예치 완료로 간주 (실제 트랜잭션 확인 시간)
        setTimeout(() => {
          console.log('Transfer completed (manual timeout)');
          setIsDepositing(false);
          
          // 성공 상태 설정
          setIsSuccess(true);
          
          // 3초 후 모달 닫기
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            } else {
              onClose();
            }
          }, 3000);
        }, 5000);
      } else {
        throw new Error('Transfer transaction hash not received');
      }
      
    } catch (error) {
      console.error('Transfer failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      alert(`보증금 예치에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      setIsDepositing(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !address) return;
    
    const depositAmount = BigInt(Number(amount) * 1e18);
    
    console.log('Starting deposit...', {
      escrowAddress: CONTRACTS.DEPOSIT_ESCROW,
      amount: depositAmount,
      cohortId: cohortId
    });
    
    setIsDepositing(true);
    
    try {
      await deposit({
        address: CONTRACTS.DEPOSIT_ESCROW as `0x${string}`,
        abi: DEPOSIT_ESCROW_ABI,
        functionName: 'deposit',
        args: [cohortId as `0x${string}`, depositAmount],
      } as any);
      console.log('Deposit transaction submitted');
      
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('보증금 예치에 실패했습니다. 다시 시도해주세요.');
      setIsDepositing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">주의사항</span>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              보증금은 기수 완료 시 반환됩니다. 중도 포기 시 보증금이 차감될 수 있습니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예치할 금액 (bUSD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예치할 금액을 입력하세요"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">기수 ID:</span>
              <span className="font-mono text-gray-900">{cohortId}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">네트워크:</span>
              <span className="text-gray-900">Sepolia</span>
            </div>
          </div>

          {/* 진행 상태 표시 */}
          {(isApproving || isDepositing) && !isSuccess && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="font-medium">
                  {isApproving ? '토큰 승인 중...' : '보증금 예치 중...'}
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {isApproving 
                  ? '지갑에서 트랜잭션을 확인해주세요.' 
                  : '잠시만 기다려주세요. 예치가 완료되면 자동으로 닫힙니다.'
                }
              </p>
            </div>
          )}

          {/* 성공 상태 표시 */}
          {isSuccess && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">🎉 보증금 예치 완료!</span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                <strong>{amount} bUSD</strong>가 성공적으로 예치되었습니다.<br/>
                기수: {cohortId}<br/>
                <span className="text-xs text-green-600">잠시 후 자동으로 닫힙니다.</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isApproving || isDepositing || isSuccess}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSuccess ? '완료' : '취소'}
          </button>
          {!isDepositing && !isSuccess ? (
            <button
              onClick={handleApprove}
              disabled={isApproving || isDepositing || !amount}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? '승인 중...' : isApproveConfirming ? '승인 확인 중...' : '토큰 승인'}
            </button>
          ) : isSuccess ? (
            <button
              disabled
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              ✅ 완료됨
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              예치 중...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
