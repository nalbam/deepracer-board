# DeepRacer Board - 프로젝트 분석 문서

## 1. 프로젝트 개요

**DeepRacer Board**는 AWS DeepRacer 레이싱 리그를 관리하고 리더보드를 제공하는 웹 애플리케이션입니다.

### 주요 특징
- Next.js 15 기반 현대적인 웹 애플리케이션
- Google OAuth 기반 안전한 인증
- 실시간 리더보드 및 이벤트 감지 시스템
- 랩타임 측정 및 관리
- Production URL: https://deepracerboard.com

## 2. 기술 스택

### Frontend
- **Next.js 15**: React 프레임워크 (App Router)
- **React 19**: 사용자 인터페이스 라이브러리
- **TypeScript**: 정적 타입 체크
- **Styling**: Custom CSS + shadcn/ui components

### Backend
- **Next.js API Routes**: 서버리스 API 엔드포인트
- **NextAuth.js v5**: 인증 및 세션 관리
- **AWS DynamoDB**: NoSQL 데이터베이스
- **AWS SDK v3**: DynamoDB 클라이언트

### 배포
- **AWS Amplify**: 호스팅 및 CI/CD
- **pnpm**: 패키지 매니저

## 3. 프로젝트 구조

```
deepracer-board/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/       # NextAuth API route
│   │   ├── leagues/
│   │   │   ├── route.ts              # GET/POST leagues
│   │   │   └── [league]/route.ts     # GET/DELETE specific league
│   │   └── racers/
│   │       ├── route.ts              # POST racer
│   │       └── [league]/route.ts     # GET/DELETE racers
│   ├── league/[league]/page.tsx      # 리더보드 페이지
│   ├── login/page.tsx                # 로그인 페이지
│   ├── manage/
│   │   ├── page.tsx                  # 대시보드
│   │   ├── league/
│   │   │   ├── page.tsx              # 리그 생성
│   │   │   └── [league]/page.tsx     # 리그 수정
│   │   └── racers/[league]/page.tsx  # 레이서 관리
│   ├── timer/
│   │   ├── page.tsx                  # 타이머 (제한 없음)
│   │   └── [min]/page.tsx            # 타이머 (시간 제한)
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # 홈 페이지
│   └── deepracer.css                 # 메인 CSS
├── components/
│   ├── common/
│   │   ├── app-header.tsx            # 통합 네비게이션
│   │   └── modal.tsx                 # 재사용 모달
│   ├── ui/                           # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── effects/
│   │   ├── pollen.tsx                # 축하 효과
│   │   ├── popup.tsx                 # 레이서 팝업
│   │   ├── scroll.tsx                # 자동 스크롤
│   │   ├── logo-popup.tsx            # 리그 로고
│   │   └── qrcode.tsx                # QR 코드
│   ├── league/
│   │   ├── league-card.tsx           # 리그 카드
│   │   ├── league-form.tsx           # 생성/수정 폼
│   │   ├── league-list.tsx           # 공개 리그
│   │   ├── my-leagues.tsx            # 내 리그
│   │   └── delete-league-modal.tsx   # 삭제 확인
│   ├── racer/
│   │   ├── racer-form.tsx            # 레이서 폼
│   │   ├── racer-manager.tsx         # 레이서 관리
│   │   └── leaderboard.tsx           # 리더보드
│   ├── timer/
│   │   └── timer.tsx                 # 타이머 컴포넌트
│   ├── manage/
│   │   ├── logout-button.tsx         # 로그아웃
│   │   └── manage-header.tsx         # 관리 페이지 헤더
│   ├── theme-provider.tsx            # 테마 프로바이더
│   └── providers.tsx                 # 앱 프로바이더
├── lib/
│   ├── actions/
│   │   └── auth.ts                   # 인증 액션
│   ├── types/
│   │   └── next-auth.d.ts            # NextAuth 타입 정의
│   ├── auth.ts                       # NextAuth 설정
│   ├── dynamodb.ts                   # DynamoDB 클라이언트
│   ├── types.ts                      # TypeScript 타입
│   └── utils.ts                      # 유틸리티
└── docs/
    ├── architecture.md               # 아키텍처
    └── data-models.md                # 데이터 모델
```

## 4. 라우팅 구조

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | app/page.tsx | 홈 페이지 (전체 리그 목록) |
| `/league/[league]` | app/league/[league]/page.tsx | 리그별 리더보드 |
| `/login` | app/login/page.tsx | Google OAuth 로그인 |
| `/manage` | app/manage/page.tsx | 대시보드 (내 리그, 전체 리그) |
| `/manage/league` | app/manage/league/page.tsx | 새 리그 생성 |
| `/manage/league/[league]` | app/manage/league/[league]/page.tsx | 리그 수정 |
| `/manage/racers/[league]` | app/manage/racers/[league]/page.tsx | 레이서 관리 |
| `/timer` | app/timer/page.tsx | 타이머 |
| `/timer/[min]` | app/timer/[min]/page.tsx | 타이머 (시간 제한) |

## 5. 주요 컴포넌트

### 페이지 컴포넌트 (Server Components)
- **app/page.tsx**: 홈 페이지, 전체 리그 목록
- **app/league/[league]/page.tsx**: 리더보드 메인 페이지
- **app/manage/page.tsx**: 대시보드 (내 리그 + 전체 리그)
- **app/manage/league/[league]/page.tsx**: 리그 생성/수정
- **app/manage/racers/[league]/page.tsx**: 레이서 관리
- **app/timer/[min]/page.tsx**: 타이머

### Client 컴포넌트

#### Common 컴포넌트
- **components/common/app-header.tsx**: 통합 네비게이션 바
  - 로고 (홈 링크)
  - Manage, Timer 링크
  - 사용자 정보 표시
  - 로그아웃 버튼

- **components/common/modal.tsx**: 재사용 가능한 모달
  - ESC 키 닫기
  - 외부 클릭 닫기
  - 제목, 본문, 푸터 슬롯

#### UI 컴포넌트 (shadcn/ui)
- **components/ui/button.tsx**: 버튼 컴포넌트
- **components/ui/card.tsx**: 카드 컴포넌트
- **components/ui/checkbox.tsx**: 체크박스
- **components/ui/input.tsx**: 입력 필드
- **components/ui/label.tsx**: 레이블
- **components/ui/toast.tsx**: 토스트 알림
- **components/ui/toaster.tsx**: 토스트 컨테이너

#### League 컴포넌트
- **components/league/league-card.tsx**: 리그 카드 표시

- **components/league/delete-league-modal.tsx**: 리그 삭제 확인
  - 리그 코드 확인 필수
  - 레이서 일괄 삭제 후 리그 삭제

#### Racer 컴포넌트
- **components/racer/racer-manager.tsx**: 레이서 목록 관리
  - 클릭하여 레이서 선택
  - 선택된 레이서 정보 폼에 자동 입력
  - 기록 있는/없는 레이서 구분 표시

- **components/racer/leaderboard.tsx**: 리더보드 표시
  - 3초마다 자동 갱신
  - 6가지 이벤트 타입 감지
  - 우선순위 기반 이벤트 선택
  - 시각 효과 통합 (Pollen, Popup, LogoPopup, Scroll)

#### Timer 컴포넌트
- **components/timer/timer.tsx**: 타이머 로직 및 UI

#### Manage 컴포넌트
- **components/manage/manage-header.tsx**: 관리 페이지 헤더

#### Provider 컴포넌트
- **components/theme-provider.tsx**: 테마 컨텍스트 제공
- **components/providers.tsx**: 앱 전역 프로바이더

### 이펙트 컴포넌트
- **components/effects/pollen.tsx**: 축하 파티클 애니메이션
- **components/effects/popup.tsx**: 레이서 정보 팝업
- **components/effects/scroll.tsx**: 자동 스크롤 (10분 간격)
- **components/effects/logo-popup.tsx**: 리그 로고 표시
- **components/effects/qrcode.tsx**: QR 코드 생성

## 6. API 엔드포인트

### Leagues API
```
GET    /api/leagues              # 사용자의 리그 목록
GET    /api/leagues?all=true     # 모든 리그 목록
POST   /api/leagues              # 리그 생성/수정
GET    /api/leagues/[league]     # 특정 리그 정보
DELETE /api/leagues/[league]     # 리그 삭제 (소유자만)
```

### Racers API
```
GET    /api/racers/[league]      # 리그의 리더보드 (순위 포함)
POST   /api/racers               # 레이서 생성/수정
DELETE /api/racers/[league]      # 리그의 모든 레이서 삭제 (소유자만)
```

### API 응답 형식
```typescript
// 성공
{
  success: true,
  data: T
}

// 실패
{
  success: false,
  error: string
}
```

## 7. 데이터베이스 스키마

### Leagues 테이블
```
league (PK)    # String - 리그 코드
title          # String - 리그 제목
logo           # String - 로고 URL
dateOpen       # Number - 시작일 (타임스탬프)
dateClose      # Number - 종료일 (타임스탬프)
userId         # String - 생성자 ID (Google OAuth sub)
registered     # Number - 등록 시간
modified       # Number - 수정 시간
```

### Racers 테이블
```
league (PK)    # String - 리그 코드
email (SK)     # String - 레이서 이메일
racerName      # String - 레이서 이름
laptime        # Number - 랩타임 (밀리초)
registered     # Number - 등록 시간
modified       # Number - 수정 시간
```

### Users 테이블 (NextAuth)
```
id (PK)        # String - 이메일 (소문자)
email          # String - 원본 이메일
name           # String - 이름
image          # String - 프로필 이미지 URL
provider       # String - "google"
lastLogin      # Number - 마지막 로그인
createdAt      # Number - 생성 시간
updatedAt      # Number - 업데이트 시간
```

## 8. 주요 기능

### 리그 관리
- 리그 생성 및 수정
- 리그 제목, 로고, 운영 기간 설정
- 고유한 리그 코드 생성
- 리그 삭제 (확인 모달 + 리그 코드 검증)
- 레이서 일괄 삭제 후 리그 삭제

### 레이서 관리
- 레이서 등록 및 정보 수정
- 클릭하여 레이서 선택 후 수정
- 랩타임 기록 (MM:SS.mmm 형식)
- 최고 기록 자동 보존 (강제 업데이트 옵션 제공)
- 이메일을 통한 고유 식별
- Legacy 데이터 자동 변환 (문자열 → 숫자)

### 리더보드
- 랩타임 기준 자동 정렬
- 3초마다 실시간 업데이트
- 상위 3명 트로피 아이콘 표시
- 6가지 이벤트 타입 감지:
  1. **NEW_CHAMPION** (우선순위 10): 새 챔피언 탄생
  2. **CHAMPION_RECORD** (우선순위 8): 챔피언 기록 갱신
  3. **TOP3_ENTRY** (우선순위 6): Top 3 진입
  4. **FIRST_LAP** (우선순위 4): 첫 완주
  5. **NEW_RACER** (우선순위 4): 신규 참가자
  6. **RECORD_UPDATE** (우선순위 2): 일반 기록 갱신
- 우선순위 기반 이벤트 선택
- 자동 스크롤 (10분 간격)

### 타이머
- 밀리초 단위 정밀 측정
- 시간 제한 설정 가능
- 베스트 랩 추적
- 사운드 효과

## 9. 이벤트 감지 시스템

### 이벤트 타입
```typescript
enum EventType {
  MANUAL = 0,           // 수동 트리거
  CHAMPION_RECORD = 1,  // 챔피언 기록 갱신
  NEW_CHAMPION = 2,     // 새 챔피언 탄생
  TOP3_ENTRY = 3,       // Top 3 진입
  RECORD_UPDATE = 4,    // 일반 기록 갱신
  FIRST_LAP = 5,        // 첫 완주
  NEW_RACER = 6,        // 신규 참가자
}
```

### 우선순위 시스템
```typescript
const EVENT_PRIORITY: Record<EventType, number> = {
  [EventType.NEW_CHAMPION]: 10,
  [EventType.CHAMPION_RECORD]: 8,
  [EventType.TOP3_ENTRY]: 6,
  [EventType.FIRST_LAP]: 4,
  [EventType.NEW_RACER]: 4,
  [EventType.RECORD_UPDATE]: 2,
  [EventType.MANUAL]: 0,
}
```

### 감지 로직
- 이메일 기반 레이서 추적 (Map 사용)
- 순위 변동 감지
- 랩타임 개선 감지
- 신규 참가자 감지
- 첫 완주 감지

## 10. 시각적 효과 (UX)

### 이펙트 컴포넌트
- **Pollen**: 축하 파티클 애니메이션 (canvas 기반)
- **Popup**: 레이서 정보 팝업 (이벤트별 차별화)
- **LogoPopup**: 리그 로고 표시
- **Scroll**: 자동 스크롤 (커스텀 easeInOutCubic)
- **QRCode**: 리그 페이지 QR 코드

### 스크롤 동작
- 10분 간격 자동 스크롤
- 레이서 수에 비례한 스크롤 속도 (레이서당 800ms)
- 하단 도달 후 8초 대기
- 상단으로 빠르게 복귀 (1.5초)
- useRef를 활용한 안정적인 카운트다운

## 11. 인증 및 보안

### NextAuth.js 인증
- Google OAuth Provider
- Custom DynamoDB Adapter
- Session 기반 인증
- JWT 토큰

### 권한 관리
- 리그 소유자 확인 (userId)
- API 라우트에서 권한 검증
- 공개 리더보드 열람 (인증 불필요)
- 관리 기능 접근 제한 (인증 필수)

### 데이터 검증
- Zod 스키마 (form validation)
- 서버사이드 검증
- 이메일 형식 검증
- 랩타임 형식 검증

## 12. 성능 최적화

### React 최적화
- Server Components 우선 사용
- useCallback, useMemo 적절히 활용
- useRef로 불필요한 재렌더링 방지
- 'use client' 필요시만 사용

### 데이터 Fetching
- cache() 함수로 중복 요청 방지
- 3초 간격 polling (리더보드)
- no-store 캐시 전략 (실시간 데이터)
- Server Components에서 데이터 사전 로드

### 번들 최적화
- Next.js 자동 코드 분할
- 이미지 최적화 (next/image)
- 폰트 최적화

## 13. 배포 구성

### AWS Amplify
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - env | grep -e AUTH >> .env
        - env | grep -e NEXT >> .env
        - pnpm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
```

### 환경 설정
- Production: https://deepracerboard.com
- HTTPS 자동 설정
- Git 기반 자동 배포

## 14. 개발 환경

### 로컬 개발
```bash
pnpm install    # 의존성 설치
pnpm dev        # 개발 서버 시작 (포트 3000)
pnpm build      # 프로덕션 빌드
pnpm lint       # ESLint 실행
```

### 필수 환경 변수
```env
AUTH_SECRET=
NEXTAUTH_URL=
AUTH_AWS_REGION=
AUTH_AWS_ACCESS_KEY_ID=
AUTH_AWS_SECRET_ACCESS_KEY=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXT_DYNAMODB_LEAGUES_TABLE=
NEXT_DYNAMODB_RACERS_TABLE=
NEXT_DYNAMODB_USERS_TABLE=
```

## 15. 코드 품질

### TypeScript
- 엄격 모드 활성화
- 모든 컴포넌트 타입 정의
- API 응답 타입 정의
- DynamoDB 타입 정의

### React 패턴
- Server Components 기본
- 'use client' 필요시만
- Custom hooks 분리
- Compound components

### 코드 스타일
- ESLint 설정
- Prettier 설정 (권장)
- 일관된 네이밍
- 주석 (한글)

## 16. 최근 개선사항 (2025-12-28)

### 주요 변경사항
1. ✅ 리그 삭제 기능 추가 (모달 + 확인)
2. ✅ 통합 네비게이션 바 (AppHeader)
3. ✅ 버튼 스타일 통일
4. ✅ 이벤트 시스템 개선 (6가지 타입)
5. ✅ 스크롤 버그 수정 (useRef 사용)
6. ✅ 모달 컴포넌트 추가
7. ✅ Racers DELETE API 추가

### 버그 수정
1. ✅ 스크롤 카운트다운 리셋 문제
   - 원인: items 의존성으로 인한 useEffect 재실행
   - 해결: useRef + useCallback 활용
2. ✅ 첫 완주 이벤트 분류 문제
3. ✅ 신규 참가자 이벤트 분류 문제
4. ✅ Legacy 랩타임 데이터 변환

## 17. 기술 부채 및 개선 계획

### 현재 이슈
- 리더보드 polling → SSE/WebSocket 전환 필요
- 에러 바운더리 추가 필요
- 테스트 커버리지 향상 필요
- 접근성 개선 (ARIA labels)

### 개선 방안
- WebSocket/SSE로 실시간 업데이트
- 에러 바운더리 컴포넌트
- Jest/React Testing Library 테스트
- ARIA labels 추가
- 다크 모드 지원
- 다국어 지원 (i18n)

## 18. 참고 문서

- [데이터 모델](./data-models.md)
- [README.md](../README.md)
