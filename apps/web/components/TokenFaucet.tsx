'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACTS, MOCK_TOKEN_ABI } from '../lib/contracts';
import { Droplets, Coins, RefreshCw } from 'lucide-react';

export function TokenFaucet() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);

  // 사용자 토큰 잔액 조회 (실시간 업데이트)
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
    abi: MOCK_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      refetchInterval: 1000, // 1초마다 자동 새로고침
      refetchOnWindowFocus: true, // 창 포커스 시 새로고침
      refetchOnMount: true, // 마운트 시 새로고침
    },
  });

  const handleMint = async () => {
    console.log('=== MINT DEBUG START ===');
    console.log('Address:', address);
    console.log('Is connected:', !!address);
    console.log('Contract address:', CONTRACTS.MOCK_TOKEN);
    console.log('writeContract function:', writeContract);
    
    if (!address) {
      console.log('No address found');
      alert('지갑을 연결해주세요.');
      return;
    }
    
    if (!writeContract) {
      console.log('writeContract is not available');
      alert('지갑 연결에 문제가 있습니다. 다시 연결해주세요.');
      return;
    }

    // 1) 체인 ID 확인
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chain ID:', chainId);
      if (chainId !== '0xaa36a7') {
        alert(`잘못된 네트워크입니다. 세폴리아(0xaa36a7)로 변경해주세요. 현재: ${chainId}`);
        return;
      }
    } catch (error) {
      console.error('Chain ID check failed:', error);
      alert('네트워크 확인에 실패했습니다.');
      return;
    }
    
    // 2) 사전 검증 - 가스 추정으로 실패 여부 미리 확인
    try {
      console.log('🔍 가스 추정 중...');
      const gasEstimate = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [{
          from: address,
          to: CONTRACTS.MOCK_TOKEN,
          data: '0x40c10f19' + address.slice(2).padStart(64, '0') + (100 * 1e18).toString(16).padStart(64, '0')
        }]
      });
      console.log('✅ 가스 추정 성공:', gasEstimate);
    } catch (error) {
      console.error('❌ 가스 추정 실패:', error);
      alert(`트랜잭션이 실패할 것 같습니다: ${error.message}`);
      return;
    }
    
    // 간단한 테스트 먼저
    alert('지갑 연결됨! 이제 트랜잭션을 시도합니다...');
    
    setIsMinting(true);
    try {
      console.log('Calling writeContract...');
      console.log('Contract config:', {
        address: CONTRACTS.MOCK_TOKEN,
        abi: MOCK_TOKEN_ABI,
        functionName: 'mint',
        args: [address, BigInt(100 * 1e18)]
      });
      
      // 100 bUSD 민팅 (테스트용)
      console.log('🚀 writeContract 호출 중...');
      
      writeContract({
        address: CONTRACTS.MOCK_TOKEN as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: 'mint',
        args: [address, BigInt(100 * 1e18)],
      }, {
        onSuccess: (hash) => {
          console.log('✅ 트랜잭션 전송 성공! Hash:', hash);
          console.log('Mint successful!');
          refetchBalance();
          alert('100 bUSD가 성공적으로 민팅되었습니다! 🎉');
        },
        onError: (error) => {
          console.error('❌ 트랜잭션 실패:', error);
          alert(`토큰 민팅에 실패했습니다: ${error.message}`);
        }
      });

      console.log('writeContract 호출 완료 (비동기 처리 중...)');
    } catch (error) {
      console.error('Mint failed:', error);
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      alert(`토큰 민팅에 실패했습니다: ${error.message}`);
    } finally {
      setIsMinting(false);
      console.log('=== MINT DEBUG END ===');
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Droplets className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">토큰 Faucet</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">
                현재 잔액: {tokenBalance ? `${Number(tokenBalance) / 1e18} bUSD` : '0 bUSD'}
              </p>
              <button
                onClick={() => refetchBalance()}
                className="p-1 hover:bg-gray-100 rounded"
                title="잔액 새로고침"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleMint}
          disabled={isMinting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Coins className="h-4 w-4" />
          <span>{isMinting ? '민팅 중...' : '100 bUSD 받기'}</span>
        </button>
      </div>
      
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>주의:</strong> 이는 테스트용 faucet입니다. 실제 가치가 없는 테스트 토큰입니다.
        </p>
      </div>
    </div>
  );
}
