import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'Bay LMS',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
  ssr: false,
  // 기본 체인을 Sepolia로 강제 설정
  initialChain: sepolia,
});
