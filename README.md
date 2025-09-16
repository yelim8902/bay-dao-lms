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
├── apps/                    # 애플리케이션들
│   ├── api/                # NestJS 백엔드 API
│   ├── web/                # Next.js 프론트엔드
│   └── indexer/            # The Graph 인덱서
├── contracts/              # 스마트 컨트랙트 (Remix 배포)
│   ├── src/               # 7개 Solidity 컨트랙트
│   └── README.md          # 배포 가이드
├── packages/               # 공통 패키지
│   └── shared/            # 타입, 컨트랙트 주소, ABI
└── docs/                  # 프로젝트 문서
    ├── ARCHITECTURE.md    # 아키텍처 가이드
    └── DEVELOPMENT.md     # 개발 가이드
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/yelim8902/bay-dao-lms.git
cd bay-dao-lms
```

### 2. 의존성 설치

```bash
# 루트에서 모든 워크스페이스 의존성 설치
npm install

# 공통 패키지 빌드
npm run build:shared
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
# 전체 개발 환경 실행 (권장)
npm run dev

# 또는 개별 실행
cd apps/web && npm run dev     # 프론트엔드 (포트 3000)
cd apps/api && npm run start:dev  # 백엔드 (포트 3001)
```

## 🔧 스마트 컨트랙트 배포

이 프로젝트는 **Remix IDE**를 사용하여 컨트랙트를 배포합니다.

### Remix IDE 배포

1. [Remix IDE](https://remix.ethereum.org/) 접속
2. `contracts/src/` 폴더의 컨트랙트 업로드
3. Solidity 컴파일러: `^0.8.24`
4. Sepolia 테스트넷에 순차 배포

자세한 배포 가이드는 [`contracts/README.md`](./contracts/README.md)를 참조하세요.

## 📋 주요 컨트랙트 주소 (Sepolia)

- **MockERC20**: `0xC5573f5c73AE55520bd8f245B74FcfcFBF2cF229`
- **DepositEscrow**: `0x34709262fc0AE346a420d892Db7Da4C52935aC99`
- **CohortManager**: `0xBdF40195cA36fe5De069eEE47E771E33d966e037`
- **AssignmentRegistry**: `0x76Be44EcFDf1886eF9aAadbc181e3348436D22ad`
- **VerifierGateway**: `0x32C48Af25fB4C4C6Fa56E542333B5f7D77EC35cF`
- **BayCertificate**: `0x169dDa5Dee64Ba4CA51dFdadB0D720580C98424D`

> 모든 컨트랙트 주소는 [`packages/shared/src/contracts.ts`](./packages/shared/src/contracts.ts)에서 중앙 관리됩니다.

## 🎯 사용법

1. **지갑 연결**: MetaMask로 Sepolia 네트워크 연결
2. **DAO 트랙 참여**: 원하는 학습 과정에 참여
3. **보증금 예치**: 학습 완료를 위한 보증금 예치
4. **과제 수행**: 학습 과제를 완료하고 제출
5. **인증서 발급**: 모든 과제 완료 시 Soulbound Token 인증서 발급
6. **보증금 반환**: 학습 완료 후 보증금 자동 반환

## 📚 문서

- **[아키텍처 가이드](./docs/ARCHITECTURE.md)**: 시스템 구조 및 데이터 플로우
- **[개발 가이드](./docs/DEVELOPMENT.md)**: 개발 환경 설정 및 워크플로우
- **[컨트랙트 가이드](./contracts/README.md)**: 스마트 컨트랙트 배포 및 사용법
- **[공통 패키지](./packages/shared/README.md)**: 타입 및 컨트랙트 정보

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

자세한 개발 가이드는 [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)를 참조하세요.

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
