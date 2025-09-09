'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GraduationCap, Menu, X, AlertTriangle, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useSwitchChain, useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { CONTRACTS, MOCK_TOKEN_ABI } from '../lib/contracts';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { chain, address } = useAccount();
  const { switchChain } = useSwitchChain();

  // 클라이언트 사이드에서만 렌더링되도록 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 가능한 bUSD 토큰 주소들 (Sepolia 테스트넷)
  const possibleBusdAddresses = [
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53', // Binance bUSD (메인넷)
    '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', // Aave bUSD
    '0xe9e7cea3dedca5984780bafc599bd69add087d56', // Binance bUSD (메인넷)
    '0x2c852e740B62308c46DD29B982FBb650D063Bd07', // Sepolia USDC (테스트용)
    '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', // Sepolia USDT (테스트용)
  ];

  // 첫 번째 주소로 bUSD 토큰 잔액 조회 시도
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: possibleBusdAddresses[0] as `0x${string}`,
    abi: [
      {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: sepolia.id,
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // 모바일 메뉴 닫기
  };

  const handleSwitchToSepolia = () => {
    if (switchChain) {
      switchChain({ chainId: sepolia.id });
    }
  };

  // 토큰 잔액을 bUSD로 변환 (18 decimals)
  const formatTokenBalance = (balance: unknown) => {
    if (!balance || typeof balance !== 'bigint') return '0.00';
    const formatted = Number(balance) / 1e18;
    return formatted.toFixed(2);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Bay DAO</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('dao-section')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              DAO
            </button>
            <button 
              onClick={() => scrollToSection('cohorts-section')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              DAO 트랙
            </button>
            <button 
              onClick={() => scrollToSection('assignments-section')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              과제
            </button>
            <button 
              onClick={() => scrollToSection('certificates-section')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              인증서
            </button>
            <button 
              onClick={() => scrollToSection('leaderboard-section')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              랭킹
            </button>
          </nav>

          {/* 지갑 연결 */}
          <div className="flex items-center space-x-4">
            {/* bUSD 잔액 표시 */}
            {isMounted && address && chain?.id === sepolia.id && (
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {formatTokenBalance(tokenBalance)} bUSD
                </span>
              </div>
            )}

            {/* 잘못된 네트워크 경고 */}
            {chain && chain.id !== sepolia.id && (
              <button
                onClick={handleSwitchToSepolia}
                className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">잘못된 네트워크</span>
              </button>
            )}
            
            <ConnectButton />

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('dao-section')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors"
              >
                DAO
              </button>
              <button 
                onClick={() => scrollToSection('cohorts-section')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors"
              >
                DAO 트랙
              </button>
              <button 
                onClick={() => scrollToSection('assignments-section')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors"
              >
                과제
              </button>
              <button 
                onClick={() => scrollToSection('certificates-section')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors"
              >
                인증서
              </button>
              <button 
                onClick={() => scrollToSection('leaderboard-section')}
                className="text-left text-gray-600 hover:text-gray-900 transition-colors"
              >
                랭킹
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
