# Bay DAO LMS

블록체인 기반의 분산 자율 조직(DAO) 학습 관리 시스템입니다.

## 🚀 주요 기능

### 스마트 컨트랙트
- **DepositEscrow**: 보증금 예치 및 반환 시스템
- **BayCertificate**: ERC721 기반 Soulbound Token 인증서
- **CohortManager**: DAO 트랙 관리 시스템
- **MockERC20**: 테스트용 ERC20 토큰

### 프론트엔드
- **Next.js 14** + **React 18** + **TypeScript**
- **Wagmi** + **RainbowKit** 지갑 연결
- **Tailwind CSS** 스타일링
- **Sepolia 테스트넷** 지원

### 핵심 기능
- ✅ **지갑 연결**: MetaMask 연동
- ✅ **DAO 트랙 참여**: 학습 과정 참여 시스템
- ✅ **보증금 시스템**: 예치 및 자동 반환
- ✅ **과제 관리**: 학습 과제 제출 및 평가
- ✅ **인증서 발급**: 완료 시 Soulbound Token 발급
- ✅ **실시간 잔액 표시**: bUSD 토큰 잔액 헤더 표시
- ✅ **네트워크 관리**: Sepolia 테스트넷 자동 연결

## 🛠️ 기술 스택

### 블록체인
- **Solidity** (스마트 컨트랙트)
- **Foundry** (개발 환경)
- **Ethereum Sepolia** (테스트넷)

### 프론트엔드
- **Next.js 14** (React 프레임워크)
- **TypeScript** (타입 안전성)
- **Tailwind CSS** (스타일링)
- **Wagmi** (Ethereum 라이브러리)
- **RainbowKit** (지갑 연결 UI)

## 📁 프로젝트 구조

```
bay_lms/
├── apps/
│   ├── api/          # NestJS 백엔드 API
│   ├── web/          # Next.js 프론트엔드
│   └── indexer/      # The Graph 인덱서
├── contracts/        # Solidity 스마트 컨트랙트
│   ├── src/         # 컨트랙트 소스 코드
│   ├── script/      # 배포 스크립트
│   └── test/        # 컨트랙트 테스트
└── packages/
    └── sdk/         # 공통 SDK
```

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/yelim8902/bay-dao-lms.git
cd bay-dao-lms
```

### 2. 의존성 설치
```bash
# 루트 의존성
npm install

# 프론트엔드 의존성
cd apps/web
npm install

# 컨트랙트 의존성
cd ../../contracts
npm install
```

### 3. 환경 변수 설정
```bash
# 프론트엔드 환경 변수
cp apps/web/env.example apps/web/.env.local

# 컨트랙트 환경 변수
cp contracts/env.example contracts/.env
```

### 4. 개발 서버 실행
```bash
# 프론트엔드 개발 서버
cd apps/web
npm run dev

# 컨트랙트 테스트넷 (별도 터미널)
cd contracts
anvil
```

## 🔧 스마트 컨트랙트 배포

### 로컬 테스트넷
```bash
cd contracts
anvil
# 별도 터미널에서
forge script script/DeployBayLMS.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

### Sepolia 테스트넷
```bash
cd contracts
forge script script/DeployBayLMS.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

## 📋 주요 컨트랙트 주소 (Sepolia)

- **DepositEscrow**: `0xd9145CCE52D386f254917e481eB44e9943F39138`
- **BayCertificate**: `0x...` (배포 예정)
- **CohortManager**: `0x...` (배포 예정)
- **MockERC20**: `0x...` (배포 예정)

## 🎯 사용법

1. **지갑 연결**: MetaMask로 Sepolia 네트워크 연결
2. **DAO 트랙 참여**: 원하는 학습 과정에 참여
3. **보증금 예치**: 학습 완료를 위한 보증금 예치
4. **과제 수행**: 학습 과제를 완료하고 제출
5. **인증서 발급**: 모든 과제 완료 시 Soulbound Token 인증서 발급
6. **보증금 반환**: 학습 완료 후 보증금 자동 반환

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **GitHub**: [@yelim8902](https://github.com/yelim8902)
- **프로젝트 링크**: [https://github.com/yelim8902/bay-dao-lms](https://github.com/yelim8902/bay-dao-lms)

## 🙏 감사의 말

- [OpenZeppelin](https://openzeppelin.com/) - 스마트 컨트랙트 라이브러리
- [Foundry](https://book.getfoundry.sh/) - 스마트 컨트랙트 개발 도구
- [Wagmi](https://wagmi.sh/) - React Ethereum 라이브러리
- [RainbowKit](https://www.rainbowkit.com/) - 지갑 연결 UI