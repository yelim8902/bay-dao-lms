# Bay LMS Smart Contracts

블록체인 기반 학습 관리 시스템(LMS)의 스마트 컨트랙트 모음입니다.

## 📁 컨트랙트 구조

```
src/
├── AssignmentRegistry.sol  # 과제 제출 및 관리
├── BayCertificate.sol     # ERC721 기반 Soulbound Token 인증서
├── CohortManager.sol      # DAO 트랙(기수) 및 팀 관리
├── DepositEscrow.sol      # 보증금 예치/반환/차감 시스템
├── IERC5192.sol          # Soulbound Token 인터페이스
├── MockERC20.sol         # 테스트용 bUSD 토큰
└── VerifierGateway.sol   # 검증 게이트웨이
```

## 🚀 배포 방법

이 프로젝트는 **Remix IDE**를 사용하여 배포합니다.

### 1. Remix IDE에서 배포

1. [Remix IDE](https://remix.ethereum.org/) 접속
2. `src/` 폴더의 컨트랙트 파일들을 업로드
3. Solidity 컴파일러 버전: `^0.8.24`
4. Sepolia 테스트넷에 배포

### 2. 배포 순서

```
1. MockERC20.sol (bUSD 토큰)
2. DepositEscrow.sol (토큰 주소 필요)
3. CohortManager.sol
4. AssignmentRegistry.sol
5. BayCertificate.sol
6. VerifierGateway.sol
```

### 3. 배포된 컨트랙트 주소 (Sepolia)

```
MockERC20: 0xC5573f5c73AE55520bd8f245B74FcfcFBF2cF229
DepositEscrow: 0x34709262fc0AE346a420d892Db7Da4C52935aC99
CohortManager: 0xBdF40195cA36fe5De069eEE47E771E33d966e037
AssignmentRegistry: 0x76Be44EcFDf1886eF9aAadbc181e3348436D22ad
VerifierGateway: 0x32C48Af25fB4C4C6Fa56E542333B5f7D77EC35cF
BayCertificate: 0x169dDa5Dee64Ba4CA51dFdadB0D720580C98424D
```

## 🔧 개발 환경

### 의존성 설치

```bash
npm install
```

### OpenZeppelin 사용

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

## 📋 주요 기능

### DepositEscrow

- 보증금 예치 (`deposit`)
- 학생 직접 반환 (`selfRefund`)
- 관리자 반환 (`refund`)
- 보증금 차감 (`slash`)

### BayCertificate

- Soulbound Token (양도 불가능)
- 개별/배치 민팅
- ERC-5192 표준 준수

### CohortManager

- DAO 트랙 생성 및 관리
- 팀 생성 및 멤버 관리

## 🌐 네트워크

- **메인넷**: 미배포
- **테스트넷**: Sepolia
- **로컬**: Remix IDE VM
