import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Bay LMS - 온체인 학습 관리 시스템',
  description: '입금·과제검증·NFT/SBT 인증서까지 완전한 온체인 LMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
