# @bay-lms/shared

Bay LMS 프로젝트에서 사용되는 공통 타입, 컨트랙트 주소, ABI 등을 정의한 공유 패키지입니다.

## 📦 포함된 내용

### 컨트랙트 주소 (`contracts.ts`)

- Sepolia 테스트넷에 배포된 모든 컨트랙트 주소
- EAS (Ethereum Attestation Service) 주소
- 네트워크 설정

### ABI 정의 (`abis.ts`)

- MockERC20 (bUSD 토큰)
- DepositEscrow (보증금 관리)
- AssignmentRegistry (과제 제출)
- CohortManager (기수 관리)
- BayCertificate (인증서 NFT)

### 타입 정의 (`types.ts`)

- 프론트엔드/백엔드에서 사용하는 공통 인터페이스
- 컨트랙트 관련 타입 정의

## 🚀 사용법

### 설치

```bash
# 프로젝트 루트에서
npm install
```

### 임포트

```typescript
import {
  CONTRACTS,
  MOCK_TOKEN_ABI,
  DEPOSIT_ESCROW_ABI,
  Assignment,
  Cohort,
  MOCK_TOKEN_CONTRACT,
} from "@bay-lms/shared";

// 컨트랙트 주소 사용
const tokenAddress = CONTRACTS.MOCK_TOKEN;

// 미리 정의된 컨트랙트 객체 사용
const tokenContract = MOCK_TOKEN_CONTRACT;
```

## 🔧 개발

### 빌드

```bash
npm run build
```

### 개발 모드 (watch)

```bash
npm run dev
```

## 📁 구조

```
src/
├── contracts.ts    # 컨트랙트 주소 및 네트워크 설정
├── abis.ts        # 스마트 컨트랙트 ABI 정의
├── types.ts       # TypeScript 타입 정의
└── index.ts       # 메인 export 파일
```

## 🌐 네트워크

- **테스트넷**: Sepolia (chainId: 11155111)
- **메인넷**: 미배포
