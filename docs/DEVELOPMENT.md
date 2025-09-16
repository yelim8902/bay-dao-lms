# Bay LMS 개발 가이드

## 🚀 빠른 시작

### 1. 저장소 클론 및 설치

```bash
git clone https://github.com/yelim8902/bay-dao-lms.git
cd bay-lms

# 루트 의존성 설치
npm install

# 워크스페이스 의존성 설치
npm run install:all
```

### 2. 환경 설정

```bash
# 프론트엔드 환경 변수
cp apps/web/env.example apps/web/.env.local

# 백엔드 환경 변수
cp apps/api/env.example apps/api/.env

# 컨트랙트 환경 변수
cp contracts/env.example contracts/.env
```

### 3. 개발 서버 실행

```bash
# 전체 개발 환경 실행
npm run dev

# 또는 개별 실행
cd apps/web && npm run dev    # 프론트엔드 (포트 3000)
cd apps/api && npm run start:dev  # 백엔드 (포트 3001)
```

## 📁 프로젝트 구조 상세

### Apps 디렉토리

```
apps/
├── api/                    # NestJS 백엔드
│   ├── src/
│   │   ├── modules/       # 비즈니스 로직
│   │   │   ├── cohort/    # 기수 관리
│   │   │   ├── assignment/ # 과제 관리
│   │   │   ├── submission/ # 제출 관리
│   │   │   ├── certificate/ # 인증서 관리
│   │   │   └── blockchain/ # 블록체인 연동
│   │   └── config/        # 설정 파일
│   └── Dockerfile
├── web/                   # Next.js 프론트엔드
│   ├── app/              # App Router
│   ├── components/       # React 컴포넌트
│   ├── contexts/         # 상태 관리
│   ├── lib/             # 유틸리티
│   └── Dockerfile
└── indexer/             # The Graph 인덱서
    ├── src/             # 이벤트 핸들러
    ├── schema.graphql   # GraphQL 스키마
    └── subgraph.yaml    # 설정
```

### Packages 디렉토리

```
packages/
└── shared/              # 공통 패키지
    ├── src/
    │   ├── contracts.ts # 컨트랙트 주소
    │   ├── abis.ts     # ABI 정의
    │   ├── types.ts    # TypeScript 타입
    │   └── index.ts    # 메인 export
    └── package.json
```

### Contracts 디렉토리

```
contracts/
├── src/                 # Solidity 소스
│   ├── DepositEscrow.sol
│   ├── BayCertificate.sol
│   ├── CohortManager.sol
│   ├── AssignmentRegistry.sol
│   ├── MockERC20.sol
│   └── VerifierGateway.sol
├── package.json        # OpenZeppelin 의존성
└── README.md          # 배포 가이드
```

## 🛠️ 개발 워크플로우

### 1. 새로운 기능 개발

#### 스마트 컨트랙트 변경

```bash
# 1. contracts/src/ 에서 Solidity 수정
# 2. Remix IDE에서 컴파일/배포
# 3. packages/shared/src/contracts.ts 주소 업데이트
# 4. packages/shared/src/abis.ts ABI 업데이트
```

#### 프론트엔드 개발

```bash
cd apps/web

# 컴포넌트 개발
# components/ 폴더에 새 컴포넌트 생성

# 상태 관리
# contexts/AppContext.tsx 업데이트

# 스타일링
# Tailwind CSS 사용
```

#### 백엔드 개발

```bash
cd apps/api

# 새 모듈 생성
nest g module feature-name
nest g controller feature-name
nest g service feature-name

# 데이터베이스 엔티티
# entities/ 폴더에 TypeORM 엔티티 생성
```

### 2. 타입 안전성

#### 공통 타입 사용

```typescript
// packages/shared/src/types.ts에 정의
import type { Assignment, Cohort } from '@bay-lms/shared';

// 프론트엔드에서 사용
const assignment: Assignment = { ... };

// 백엔드에서 사용
@Entity()
export class Assignment implements Assignment { ... }
```

#### 컨트랙트 타입 안전성

```typescript
import { CONTRACTS, MOCK_TOKEN_ABI } from "@bay-lms/shared";

// Wagmi에서 타입 안전한 컨트랙트 호출
const { data } = useReadContract({
  address: CONTRACTS.MOCK_TOKEN,
  abi: MOCK_TOKEN_ABI,
  functionName: "balanceOf",
  args: [userAddress],
});
```

### 3. 테스트

#### 프론트엔드 테스트

```bash
cd apps/web
npm run test        # Jest + React Testing Library
npm run test:e2e    # Playwright E2E 테스트
```

#### 백엔드 테스트

```bash
cd apps/api
npm run test        # Unit 테스트
npm run test:e2e    # E2E 테스트
npm run test:cov    # 커버리지
```

#### 컨트랙트 테스트

```bash
cd contracts
# Remix IDE에서 테스트
# 또는 Hardhat 로컬 테스트
npx hardhat test
```

## 🔧 유용한 명령어

### 전체 프로젝트

```bash
npm run dev         # 모든 앱 개발 모드 실행
npm run build       # 모든 앱 빌드
npm run clean       # 캐시 및 빌드 파일 정리
npm run build:shared # 공통 패키지 빌드
```

### 개별 앱

```bash
# 웹 앱
cd apps/web
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run lint        # ESLint 검사

# API 서버
cd apps/api
npm run start:dev   # 개발 서버 (hot reload)
npm run start:debug # 디버그 모드
npm run build       # 빌드
```

### 공통 패키지

```bash
cd packages/shared
npm run build       # TypeScript 컴파일
npm run dev         # Watch 모드
```

## 🐛 디버깅

### 프론트엔드 디버깅

```bash
# 브라우저 개발자 도구 사용
# React Developer Tools
# Wagmi Devtools (개발 모드에서 자동 활성화)
```

### 백엔드 디버깅

```bash
# NestJS 디버그 모드
npm run start:debug

# 로그 레벨 설정
LOG_LEVEL=debug npm run start:dev
```

### 블록체인 디버깅

```bash
# Sepolia Etherscan에서 트랜잭션 확인
# https://sepolia.etherscan.io/

# 컨트랙트 이벤트 모니터링
# The Graph Studio에서 인덱싱 상태 확인
```

## 📚 추가 리소스

### 문서

- [Next.js 14 문서](https://nextjs.org/docs)
- [NestJS 문서](https://docs.nestjs.com/)
- [Wagmi 문서](https://wagmi.sh/)
- [The Graph 문서](https://thegraph.com/docs/)

### 도구

- [Remix IDE](https://remix.ethereum.org/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)
- [The Graph Studio](https://thegraph.com/studio/)

## 🤝 기여 가이드

1. **Fork** 프로젝트
2. **Feature branch** 생성 (`git checkout -b feature/amazing-feature`)
3. **Commit** 변경사항 (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Pull Request** 생성

### 코딩 컨벤션

- **TypeScript** 사용 (모든 코드)
- **ESLint + Prettier** 준수
- **컴포넌트**: PascalCase
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE
