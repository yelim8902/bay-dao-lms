# Bay LMS 아키텍처 가이드

## 🏗️ 전체 구조

Bay LMS는 블록체인 기반의 분산 학습 관리 시스템으로, 다음과 같은 구조로 구성되어 있습니다:

```
bay_lms/
├── apps/                    # 애플리케이션들
│   ├── api/                # NestJS 백엔드 API
│   ├── web/                # Next.js 프론트엔드
│   └── indexer/            # The Graph 인덱서
├── contracts/              # 스마트 컨트랙트 (Remix 배포)
├── packages/               # 공통 패키지
│   └── shared/            # 타입, 컨트랙트 주소, ABI
└── docs/                  # 프로젝트 문서
```

## 🔄 데이터 플로우

### 1. 블록체인 레이어

```
스마트 컨트랙트 (Sepolia)
├── DepositEscrow     # 보증금 관리
├── BayCertificate    # SBT 인증서
├── CohortManager     # 기수/팀 관리
├── AssignmentRegistry # 과제 제출
└── MockERC20         # bUSD 토큰
```

### 2. 인덱싱 레이어

```
The Graph Protocol
├── 블록체인 이벤트 실시간 수집
├── GraphQL API 제공
└── 효율적인 데이터 조회
```

### 3. 백엔드 레이어

```
NestJS API
├── 사용자 인증/권한
├── 과제 관리
├── 제출 처리
└── 인증서 발급 로직
```

### 4. 프론트엔드 레이어

```
Next.js + Wagmi
├── 지갑 연결 (RainbowKit)
├── 컨트랙트 상호작용
├── 실시간 UI 업데이트
└── 사용자 대시보드
```

## 🎯 핵심 워크플로우

### 학습 참여 플로우

1. **지갑 연결**: MetaMask 연동
2. **기수 선택**: DAO 트랙 참여
3. **보증금 예치**: DepositEscrow 컨트랙트
4. **과제 수행**: AssignmentRegistry 제출
5. **인증서 발급**: BayCertificate SBT 민팅
6. **보증금 반환**: 완료 후 자동 반환

### 기술적 상호작용

```
사용자 → 프론트엔드 → 스마트 컨트랙트
                  ↓
              The Graph 인덱서
                  ↓
              GraphQL API
                  ↓
              백엔드 API
                  ↓
              데이터베이스
```

## 🛠️ 개발 도구

### 스마트 컨트랙트

- **개발**: Hardhat (컴파일/테스트)
- **배포**: Remix IDE
- **네트워크**: Sepolia 테스트넷

### 프론트엔드

- **프레임워크**: Next.js 14 (App Router)
- **블록체인**: Wagmi + RainbowKit
- **스타일링**: Tailwind CSS
- **상태관리**: React Context

### 백엔드

- **프레임워크**: NestJS
- **데이터베이스**: PostgreSQL + TypeORM
- **캐싱**: Redis
- **블록체인 연동**: Ethers.js

### 인덱싱

- **프로토콜**: The Graph
- **언어**: AssemblyScript
- **스키마**: GraphQL

## 📦 패키지 관리

### 워크스페이스 구조

```json
{
  "workspaces": ["apps/*", "packages/*", "contracts"]
}
```

### 공통 패키지 (@bay-lms/shared)

- 컨트랙트 주소 통합 관리
- ABI 정의 중앙화
- TypeScript 타입 공유
- 환경별 설정 관리

## 🔐 보안 고려사항

### 스마트 컨트랙트

- OpenZeppelin 라이브러리 사용
- Soulbound Token (ERC-5192) 구현
- 보증금 차감 로직 (슬래싱)
- 권한 기반 접근 제어

### 프론트엔드

- 지갑 연결 보안
- 트랜잭션 검증
- 환경 변수 관리
- HTTPS 강제

### 백엔드

- JWT 인증
- API 레이트 리미팅
- 입력 검증
- SQL 인젝션 방지

## 🚀 배포 전략

### 개발 환경

```bash
# 전체 개발 서버 실행
npm run dev

# 개별 앱 실행
cd apps/web && npm run dev
cd apps/api && npm run start:dev
```

### 프로덕션 배포

1. **컨트랙트**: Remix → Sepolia/Mainnet
2. **인덱서**: The Graph Studio
3. **백엔드**: Docker + 클라우드
4. **프론트엔드**: Vercel/Netlify

## 📊 모니터링

### 블록체인

- Etherscan 트랜잭션 추적
- 컨트랙트 이벤트 모니터링
- 가스비 최적화

### 애플리케이션

- 사용자 활동 로그
- API 응답 시간
- 에러 추적 (Sentry)

### 인프라

- 서버 리소스 모니터링
- 데이터베이스 성능
- 네트워크 상태
