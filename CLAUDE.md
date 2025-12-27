# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

DeepRacer Board는 AWS DeepRacer 레이싱 리그 관리 및 리더보드 시스템입니다. Next.js 15로 구축되어 있으며, 리그 생성, 랩타임 추적, 실시간 리더보드 표시 기능을 제공합니다.

**프로덕션 배포**: https://dracer.io

## 마이그레이션 컨텍스트

이 프로젝트는 `../deepracer-board-v1`에서 Next.js로 마이그레이션된 버전입니다.

### 주요 기술 스택 변경사항

```
v1 (React SPA)              →  v2 (Next.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
React 16.14 + CRA           →  Next.js 15 + React 19
React Router v6             →  Next.js App Router
AWS Amplify CLI             →  AWS SDK 직접 연동
API Gateway + Lambda        →  Next.js API Routes
AWS Cognito                 →  NextAuth.js v5 (beta)
Cognito User Pool           →  Google OAuth
Bootstrap 4                 →  Tailwind CSS + shadcn/ui
JavaScript                  →  TypeScript 5.4+
npm                         →  pnpm
```

**중요**: `docs/` 폴더의 레거시 문서는 v1 아키텍처(Amplify + Lambda)를 참조할 수 있습니다. 현재 코드를 최우선 참고하고, 마이그레이션 계획은 `docs/nextjs-migration-plan.md`를 확인하세요.

## 개발 명령어

```bash
# 개발 서버 (Turbopack 사용)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 검사
pnpm lint

# 타입 체크 (커밋 전 필수 실행)
pnpm type-check
```

**중요**: 이 프로젝트는 **pnpm**을 사용합니다. npm이나 yarn을 사용하지 마세요.

## 아키텍처 개요

### 인증 시스템 (Authentication)

**NextAuth.js v5 (beta)** + Google OAuth 사용:

- 설정 파일: `lib/auth.ts`
- Provider: Google OAuth만 활성화 (`AUTH_GOOGLE_ENABLED=true`일 때)
- 세션 관리: JWT 토큰 기반 (쿠키 저장)
- 사용자 동기화: 로그인 시 DynamoDB `users` 테이블에 자동 생성/업데이트 (`upsertUser()` 콜백)
- 사용자 ID: 이메일 주소를 소문자로 정규화하여 사용

#### 보호된 라우트

- `/manage/*` - 인증 필요 (리그/레이서 관리)
- `/`, `/league/[league]` - 공개 (리더보드 조회)
- `/login` - 로그인 페이지

#### Middleware 패턴

`middleware.ts`는 NextAuth의 `authorized` 콜백(`lib/auth.ts`)에 라우트 보호 로직을 위임합니다. 이렇게 하면 인증 로직이 중앙 집중화됩니다.

### 데이터베이스 아키텍처 (DynamoDB)

#### 3개의 주요 테이블

1. **Leagues 테이블** (`deepracer-board-leagues`)
   - Partition Key: `league` (string) - 리그 고유 코드
   - 속성: `title`, `logo`, `dateOpen`, `dateClose`, `userId`, `registered`, `modified`

2. **Racers 테이블** (`deepracer-board-racers`)
   - Partition Key: `league` (string)
   - Sort Key: `email` (string)
   - 속성: `racerName`, `laptime` (밀리초), `registered`, `modified`

3. **Users 테이블** (`deepracer-board-users`)
   - Partition Key: `id` (string) - 소문자 이메일
   - 속성: `email`, `name`, `image`, `provider`, `lastLogin`, `createdAt`, `updatedAt`
   - Google OAuth 로그인 시 자동 생성/업데이트

#### DynamoDB 클라이언트 패턴

모든 데이터베이스 작업은 `lib/dynamodb.ts`의 Document Client를 사용합니다:

```typescript
import { docClient } from '@/lib/dynamodb';
import { success, failure, apiSuccess, apiError } from '@/lib/dynamodb';

// 서비스 레이어에서 Result<T> 타입 사용
export async function getLeague(code: string): Promise<Result<League>> {
  try {
    const result = await docClient.get({ /* ... */ });
    return success(result.Item as League);
  } catch (error) {
    return failure('Failed to fetch league');
  }
}

// API 라우트에서 apiSuccess/apiError 사용
export async function GET(request: Request) {
  const result = await getLeague(code);
  if (!result.success) return apiError(result.error, 404);
  return apiSuccess(result.data);
}
```

### API Routes 구조

Next.js App Router 규칙을 따릅니다 (`app/api/*/route.ts`):

#### Leagues API
- `GET /api/leagues` - 사용자 리그 목록 (인증 필요)
- `GET /api/leagues?all=true` - 전체 공개 리그 목록
- `POST /api/leagues` - 리그 생성/수정 (인증 필요)
- `GET /api/leagues/[league]` - 특정 리그 조회
- `DELETE /api/leagues/[league]` - 리그 삭제 (소유자만)

#### Racers API
- `GET /api/racers/[league]` - 리그별 리더보드
- `POST /api/racers` - 레이서 생성/수정/삭제

#### API 패턴

```typescript
import { auth } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/dynamodb';

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return apiError('Unauthorized', 401);

  // 로직 구현
  return apiSuccess(data);
}
```

### 핵심 비즈니스 로직

#### 랩타임 업데이트 규칙 (중요 - 절대 변경 금지)

- **더 빠른 기록만** 업데이트 (기존 최고 기록 보존)
- 랩타임이 없는 경우 무조건 저장
- 위치: `app/api/racers/route.ts`

```typescript
// 올바른 랩타임 업데이트 로직
if (!existingRacer.laptime || newLaptime < existingRacer.laptime) {
  existingRacer.laptime = newLaptime;
  existingRacer.modified = Date.now();
}
```

#### 리더보드 정렬 규칙

1. 1차 정렬: 랩타임 오름차순 (빠른 시간 우선)
2. 2차 정렬: 등록 시간 오름차순 (동점 시 먼저 등록한 사람 우선)
3. 랩타임 없음: 목록 하단 표시

#### 실시간 업데이트

- 현재 구현: 클라이언트 사이드 폴링 (5초 간격)
- 리더보드 컴포넌트: `components/racer/leaderboard.tsx`
- 향후 개선 고려사항: SSE 또는 WebSocket

## TypeScript 패턴

### 타입 정의

모든 타입은 `lib/types.ts`에 중앙 집중화:
- `League`, `Racer`, `User` - 데이터베이스 엔티티 타입
- `LeagueInput`, `RacerInput` - API 요청 타입
- `ApiResponse<T>` - 표준 API 응답 래퍼
- `Result<T>` - 서비스 레이어 결과 타입 (`lib/dynamodb.ts`)

### Import 별칭

절대 경로 임포트는 `@/` 사용 (tsconfig.json 설정):

```typescript
import { auth } from '@/lib/auth';
import { League } from '@/lib/types';
import { docClient } from '@/lib/dynamodb';
```

## 환경 변수 설정

필수 환경 변수 (자세한 내용은 `README.md` 참조):

```env
# NextAuth.js 인증
AUTH_SECRET              # openssl rand -hex 32로 생성
NEXTAUTH_URL            # 애플리케이션 URL
AUTH_GOOGLE_ID          # Google OAuth 클라이언트 ID
AUTH_GOOGLE_SECRET      # Google OAuth 클라이언트 시크릿

# AWS 자격 증명
AUTH_AWS_REGION
AUTH_AWS_ACCESS_KEY_ID
AUTH_AWS_SECRET_ACCESS_KEY

# DynamoDB 테이블 이름
NEXT_DYNAMODB_LEAGUES_TABLE
NEXT_DYNAMODB_RACERS_TABLE
NEXT_DYNAMODB_USERS_TABLE
```

## 컴포넌트 아키텍처

### UI 컴포넌트

- **shadcn/ui** + Radix UI 기반 컴포넌트
- 기본 컴포넌트 위치: `components/ui/`
- Tailwind CSS로 스타일링
- `next-themes`로 다크 모드 지원

### 기능 컴포넌트

- `components/league/` - 리그 카드, 목록, 폼
- `components/racer/` - 리더보드 표시
- Server Component와 Client Component 혼용 (`"use client"` 지시어 확인)

## 배포 설정

### AWS Amplify 배포 (`amplify.yml`)

- 빌드 도구: **pnpm** (npm 아님)
- 환경 변수는 Amplify 환경 설정에서 주입
- 빌드 산출물: `.next/` 디렉토리
- Node.js 20+ 필수

## 중요한 규칙

### 타임스탬프 처리

Unix 타임스탬프(**밀리초**)를 사용합니다:

```typescript
const now = Date.now(); // 1970년 1월 1일 이후 밀리초 반환
```

모든 `registered`, `modified`, `lastLogin` 등의 필드는 밀리초 단위입니다.

### 랩타임 저장 형식

- 데이터베이스: **밀리초** 단위 정수 저장
- UI 표시: MM:SS.mmm 형식으로 변환 (UI 레이어에서 처리)

예: `65432` (DB) → `1:05.432` (UI)

### 리그 코드 형식

- URL-safe 식별자 사용
- 허용 문자: `[a-zA-Z0-9-]+`
- 사용자 입력 검증 필요

### 권한 검증 패턴

소유자 검증 시 세션의 `user.id` (이메일)와 `userId` 필드 비교:

```typescript
const session = await auth();
if (league.userId !== session.user.id) {
  return apiError('Forbidden', 403);
}
```

## 주의사항 (Common Gotchas)

### 1. NextAuth 세션 타입 확장

커스텀 세션 타입은 `id`와 `provider` 필드를 포함합니다. 타입 확장은 `lib/types/next-auth.d.ts`에 정의되어 있습니다.

### 2. DynamoDB 빈 값 처리

Document Client는 `removeUndefinedValues: true`로 설정되어 있습니다. 선택적 필드는 `undefined`를 사용하고, `null`을 사용하지 마세요.

```typescript
// 올바른 방법
const league = {
  league: 'test-league',
  title: 'Test',
  logo: undefined  // 선택적 필드
};

// 잘못된 방법
const league = {
  league: 'test-league',
  title: 'Test',
  logo: null  // DynamoDB 에러 발생 가능
};
```

### 3. Middleware Matcher

정적 자산, API 라우트, Next.js 내부 경로는 인증 미들웨어에서 제외됩니다. 라우트 패턴 수정 전 `middleware.ts`의 `config.matcher` 확인이 필요합니다.

### 4. Server vs Client Component

대부분의 페이지 컴포넌트는 Server Component입니다. 다음 경우에만 `"use client"` 사용:
- 폼 및 상호작용
- 브라우저 API 사용 (localStorage, window 등)
- React Hooks 사용 (useState, useEffect 등)

### 5. v1 코드 참조 시 주의

v1 프로젝트의 코드를 참조할 때:
- **클래스 컴포넌트** → 함수형 컴포넌트로 변환 필요
- **Amplify API 호출** → Next.js API Routes 또는 직접 DynamoDB 호출로 변경
- **Cognito 인증** → NextAuth 세션으로 변경
- **Context API** → 필요 시 Server Component props 또는 Client 상태 관리

## 테스트 및 디버깅

### 타입 체크

커밋 전 **반드시** 타입 체크 실행:

```bash
pnpm type-check
```

빌드 시 타입 에러가 발생하면 실패합니다.

### NextAuth 디버그 모드

`.env.local`에서 `AUTH_DEBUG=true` 설정 시 상세 인증 로그가 출력됩니다.

### DynamoDB 로컬 개발

자격 증명은 환경 변수 또는 AWS credentials 파일(`~/.aws/credentials`)에서 자동으로 로드됩니다. `lib/dynamodb.ts`의 자격 증명 해석 로직을 참조하세요.

## 참고 문서

- **아키텍처**: `docs/project-analysis.md` (한국어)
- **데이터 모델**: `docs/data-models.md` (한국어)
- **마이그레이션 계획**: `docs/nextjs-migration-plan.md` (한국어)
- **README**: `README.md` (영어)

**중요**: `docs/` 폴더의 문서는 v1 아키텍처를 참조할 수 있으므로, 현재 코드베이스를 최우선으로 참조하세요.
