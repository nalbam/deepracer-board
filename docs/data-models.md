# DeepRacer Board - 데이터 모델 및 API 사양

## 1. 데이터 모델

### League (리그)
리그는 DeepRacer 대회를 나타내는 핵심 엔티티입니다.

```typescript
interface League {
  // Primary Key
  league: string;           // 리그 고유 코드 (예: "2024-winter-cup")

  // Attributes
  title: string;            // 리그 제목 (예: "2024 Winter Championship")
  logo?: string;            // 로고 이미지 URL
  dateOpen: number;         // 시작 날짜 (Unix timestamp)
  dateClose: number;        // 종료 날짜 (Unix timestamp)

  // Metadata
  userId: string;           // 생성자 Google OAuth sub
  registered: number;       // 생성 타임스탬프 (Unix timestamp)
  modified: number;         // 수정 타임스탬프 (Unix timestamp)
}
```

### Racer (레이서)
레이서는 리그에 참가하는 참가자를 나타냅니다.

```typescript
interface Racer {
  // Composite Key
  league: string;           // 리그 코드 (Partition Key)
  email: string;            // 레이서 이메일 (Sort Key)

  // Attributes
  racerName: string;        // 레이서 표시 이름
  laptime: number;          // 최고 랩타임 (밀리초)

  // Metadata
  registered: number;       // 등록 타임스탬프
  modified: number;         // 수정 타임스탬프
}
```

### LeaderboardEntry (리더보드 항목)
리더보드 API 응답에 포함되는 레이서 정보 (순위 포함)

```typescript
interface LeaderboardEntry extends Racer {
  rank: number;             // 순위 (1부터 시작, 0은 기록 없음)
}
```

### User (사용자)
NextAuth.js를 통해 관리되는 사용자 정보

```typescript
interface User {
  // Primary Key
  id: string;               // 이메일 (소문자)

  // OAuth Information
  email: string;            // 원본 이메일
  name: string;             // 사용자 이름
  image?: string;           // 프로필 이미지 URL
  provider: string;         // "google"

  // Metadata
  lastLogin: number;        // 마지막 로그인 타임스탬프
  createdAt: number;        // 생성 타임스탬프
  updatedAt: number;        // 업데이트 타임스탬프
}
```

### Timer Session (타이머 세션)
타이머 페이지에서 사용되는 클라이언트 전용 데이터 구조

```typescript
interface TimerSession {
  currentTime: number;      // 현재 진행 중인 시간 (밀리초)
  startTime?: number;       // 시작 타임스탬프
  bestTime?: number;        // 세션 내 최고 기록
  lastTime?: number;        // 직전 기록
  laps: number[];          // 전체 랩 기록 배열
  status: 'idle' | 'running' | 'stopped';
  timeLimit?: number;       // 시간 제한 (분)
}
```

## 2. DynamoDB 테이블 스키마

### deepracer-board-leagues 테이블

| 속성 | 타입 | 키 타입 | 설명 | 예시 |
|------|------|---------|------|------|
| league | String | Partition Key | 리그 고유 식별자 | "2024-winter" |
| title | String | - | 리그 제목 | "2024 Winter Championship" |
| logo | String | - | 로고 URL | "https://cdn.../logo.png" |
| dateOpen | Number | - | 시작일 (타임스탬프) | 1704067200000 |
| dateClose | Number | - | 종료일 (타임스탬프) | 1706745599000 |
| userId | String | - | 생성자 Google OAuth sub | "google_123456789" |
| registered | Number | - | 생성 시간 | 1704067200000 |
| modified | Number | - | 수정 시간 | 1704067200000 |

**Global Secondary Indexes**: 없음

### deepracer-board-racers 테이블

| 속성 | 타입 | 키 타입 | 설명 | 예시 |
|------|------|---------|------|------|
| league | String | Partition Key | 리그 코드 | "2024-winter" |
| email | String | Sort Key | 레이서 이메일 | "racer@example.com" |
| racerName | String | - | 표시 이름 | "SpeedRacer" |
| laptime | Number | - | 랩타임 (밀리초) | 65432 |
| registered | Number | - | 등록 시간 | 1704067200000 |
| modified | Number | - | 수정 시간 | 1704067200000 |

**Global Secondary Indexes**: 없음

**주의**: Legacy 데이터는 laptime이 문자열 형식("00:12.345")일 수 있으며, API에서 자동으로 숫자로 변환됩니다.

### deepracer-board-users 테이블

| 속성 | 타입 | 키 타입 | 설명 | 예시 |
|------|------|---------|------|------|
| id | String | Partition Key | 이메일 (소문자) | "user@example.com" |
| email | String | - | 원본 이메일 | "user@example.com" |
| name | String | - | 사용자 이름 | "John Doe" |
| image | String | - | 프로필 이미지 URL | "https://lh3.googleusercontent.com/..." |
| provider | String | - | OAuth 제공자 | "google" |
| lastLogin | Number | - | 마지막 로그인 | 1704067200000 |
| createdAt | Number | - | 생성 시간 | 1704067200000 |
| updatedAt | Number | - | 업데이트 시간 | 1704067200000 |

**Global Secondary Indexes**: 없음

## 3. REST API 엔드포인트

### API 응답 형식

모든 API는 다음 형식으로 응답합니다:

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

### Leagues API

#### 1. 사용자 리그 목록 조회
```http
GET /api/leagues
Authorization: Required (NextAuth session)

Response 200:
{
  "success": true,
  "data": [
    {
      "league": "2024-winter",
      "title": "2024 Winter Championship",
      "logo": "https://cdn.../logo.png",
      "dateOpen": 1704067200000,
      "dateClose": 1706745599000,
      "userId": "google_123456789",
      "registered": 1704067200000,
      "modified": 1704067200000
    }
  ]
}

Response 401:
{
  "success": false,
  "error": "Unauthorized"
}
```

#### 2. 전체 리그 목록 조회
```http
GET /api/leagues?all=true

Response 200:
{
  "success": true,
  "data": [
    {
      "league": "2024-winter",
      "title": "2024 Winter Championship",
      "logo": "https://cdn.../logo.png",
      "dateOpen": 1704067200000,
      "dateClose": 1706745599000,
      "userId": "google_123456789",
      "registered": 1704067200000,
      "modified": 1704067200000
    },
    {
      "league": "2024-spring",
      "title": "2024 Spring Tournament",
      "logo": "https://cdn.../logo2.png",
      "dateOpen": 1709251200000,
      "dateClose": 1711929599000,
      "userId": "google_987654321",
      "registered": 1709251200000,
      "modified": 1709251200000
    }
  ]
}
```

#### 3. 특정 리그 조회
```http
GET /api/leagues/{league}

Response 200:
{
  "success": true,
  "data": {
    "league": "2024-winter",
    "title": "2024 Winter Championship",
    "logo": "https://cdn.../logo.png",
    "dateOpen": 1704067200000,
    "dateClose": 1706745599000,
    "userId": "google_123456789",
    "registered": 1704067200000,
    "modified": 1704067200000
  }
}

Response 404:
{
  "success": false,
  "error": "League not found"
}
```

#### 4. 리그 생성/수정
```http
POST /api/leagues
Authorization: Required (NextAuth session)
Content-Type: application/json

{
  "league": "2024-winter",
  "title": "2024 Winter Championship",
  "logo": "https://cdn.../logo.png",
  "dateOpen": 1704067200000,
  "dateClose": 1706745599000
}

Response 200:
{
  "success": true,
  "data": {
    "league": "2024-winter",
    "title": "2024 Winter Championship",
    "logo": "https://cdn.../logo.png",
    "dateOpen": 1704067200000,
    "dateClose": 1706745599000,
    "userId": "google_123456789",
    "registered": 1704067200000,
    "modified": 1704067200000
  }
}

Response 400:
{
  "success": false,
  "error": "Invalid league data"
}

Response 401:
{
  "success": false,
  "error": "Unauthorized"
}
```

#### 5. 리그 삭제
```http
DELETE /api/leagues/{league}
Authorization: Required (NextAuth session)

Response 200:
{
  "success": true,
  "data": {
    "message": "League deleted successfully"
  }
}

Response 403:
{
  "success": false,
  "error": "Forbidden: You can only delete your own leagues"
}

Response 404:
{
  "success": false,
  "error": "League not found"
}
```

### Racers API

#### 1. 리그별 리더보드 조회 (순위 포함)
```http
GET /api/racers/{league}

Response 200:
{
  "success": true,
  "data": [
    {
      "league": "2024-winter",
      "email": "racer1@example.com",
      "racerName": "SpeedRacer",
      "laptime": 65432,
      "rank": 1,
      "registered": 1704067200000,
      "modified": 1704067200000
    },
    {
      "league": "2024-winter",
      "email": "racer2@example.com",
      "racerName": "Lightning",
      "laptime": 67890,
      "rank": 2,
      "registered": 1704067300000,
      "modified": 1704067300000
    },
    {
      "league": "2024-winter",
      "email": "racer3@example.com",
      "racerName": "NoTime",
      "laptime": 0,
      "rank": 0,
      "registered": 1704067400000,
      "modified": 1704067400000
    }
  ]
}

Response 500:
{
  "success": false,
  "error": "Failed to fetch racers"
}
```

**정렬 규칙**:
1. 랩타임이 있는 레이서: 랩타임 오름차순 (빠른 순)
2. 동일 랩타임: 등록 시간 오름차순 (먼저 등록한 순)
3. 랩타임이 없는 레이서: 목록 하단 (rank: 0)

#### 2. 레이서 생성/수정
```http
POST /api/racers
Content-Type: application/json

{
  "league": "2024-winter",
  "email": "racer@example.com",
  "racerName": "NewRacer",
  "laptime": 70000,
  "forceUpdate": false
}

Response 200:
{
  "success": true,
  "data": {
    "league": "2024-winter",
    "email": "racer@example.com",
    "racerName": "NewRacer",
    "laptime": 70000,
    "registered": 1704067200000,
    "modified": 1704067200000
  }
}

Response 400:
{
  "success": false,
  "error": "Invalid racer data"
}
```

**랩타임 업데이트 로직**:
- `forceUpdate: false` (기본값): 새 랩타임이 더 빠른 경우에만 업데이트
- `forceUpdate: true`: 무조건 업데이트 (더 느린 시간으로도 변경 가능)
- 랩타임이 없는 경우: 무조건 저장

**Legacy 데이터 처리**:
- 기존 랩타임이 문자열("00:12.345") 형식인 경우 자동 변환
- MM:SS.mmm → 밀리초로 변환

#### 3. 리그의 모든 레이서 삭제
```http
DELETE /api/racers/{league}
Authorization: Required (NextAuth session)

Response 200:
{
  "success": true,
  "data": {
    "message": "All racers deleted successfully",
    "deletedCount": 25
  }
}

Response 403:
{
  "success": false,
  "error": "Forbidden: You can only delete racers from your own leagues"
}

Response 404:
{
  "success": false,
  "error": "League not found"
}
```

**처리 방식**:
- BatchWrite를 사용하여 25개씩 묶어서 삭제
- 리그 소유자만 삭제 가능 (userId 확인)
- 삭제된 레이서 수 반환

## 4. 비즈니스 로직

### 랩타임 업데이트 규칙

#### 기본 모드 (forceUpdate: false)
```javascript
// Legacy 데이터 변환
const existingLaptime = parseExistingLaptime(existingRacer.laptime);

// 업데이트 조건
if (existingLaptime === 0 || newLaptime < existingLaptime) {
  // 최초 기록이거나 신기록인 경우만 업데이트
  racer.laptime = newLaptime;
  racer.modified = Date.now();
}
```

#### 강제 업데이트 모드 (forceUpdate: true)
```javascript
// 무조건 업데이트
racer.laptime = newLaptime;
racer.modified = Date.now();
```

### Legacy 랩타임 변환
```typescript
function parseExistingLaptime(laptime: string | number): number {
  if (typeof laptime === 'number') return laptime;
  if (!laptime || laptime === '0' || laptime === '') return 0;

  try {
    // "MM:SS.mmm" → 밀리초
    const parts = laptime.split(':');
    if (parts.length !== 2) return 0;

    const minutes = parseInt(parts[0], 10);
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0], 10);
    const milliseconds = secondsParts[1]
      ? parseInt(secondsParts[1].padEnd(3, '0'), 10)
      : 0;

    return minutes * 60000 + seconds * 1000 + milliseconds;
  } catch {
    return 0;
  }
}
```

### 리더보드 정렬 규칙
```typescript
// 1. 랩타임이 있는 레이서만 필터링
const sortedRacers = racers
  .filter((racer) => racer.laptime > 0)
  .sort((a, b) => {
    // 2. 동일 시간: 먼저 등록한 순
    if (a.laptime === b.laptime) {
      return a.registered - b.registered;
    }
    // 3. 빠른 시간 순
    return a.laptime - b.laptime;
  });

// 4. 랩타임이 없는 레이서는 하단에 표시
const noTimeRacers = racers.filter((racer) => racer.laptime === 0);

// 5. 순위 정보 추가
const leaderboard: LeaderboardEntry[] = [
  ...sortedRacers.map((racer, index) => ({
    ...racer,
    rank: index + 1,
  })),
  ...noTimeRacers.map((racer) => ({
    ...racer,
    rank: 0, // 순위 없음
  })),
];
```

### 권한 관리

#### 리그 권한
```javascript
// 리그 생성: 인증된 사용자
if (!session?.user?.id) {
  return apiError('Unauthorized', 401);
}

// 리그 수정/삭제: 리그 소유자만
if (league.userId !== session.user.id) {
  return apiError('Forbidden: You can only modify your own leagues', 403);
}
```

#### 레이서 권한
```javascript
// 레이서 조회: 인증 불필요 (공개)
// 레이서 등록/수정: 인증 불필요 (누구나 가능)
// 레이서 일괄 삭제: 리그 소유자만
if (leagueData.userId !== session.user.id) {
  return apiError('Forbidden: You can only delete racers from your own leagues', 403);
}
```

## 5. 시간 형식 변환

### 랩타임 표시 형식
밀리초를 MM:SS.mmm 형식으로 변환

```typescript
function formatLaptime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// 예시
formatLaptime(65432);  // "1:05.432"
formatLaptime(123456); // "2:03.456"
formatLaptime(8764);   // "0:08.764"
```

### 랩타임 입력 파싱
MM:SS.mmm 형식을 밀리초로 변환

```typescript
function parseLaptimeInput(input: string): number {
  // "1:05.432" → 65432
  const parts = input.split(':');
  if (parts.length !== 2) return 0;

  const minutes = parseInt(parts[0], 10);
  const secondsParts = parts[1].split('.');
  const seconds = parseInt(secondsParts[0], 10);
  const milliseconds = secondsParts[1]
    ? parseInt(secondsParts[1].padEnd(3, '0'), 10)
    : 0;

  return minutes * 60000 + seconds * 1000 + milliseconds;
}
```

### 날짜 표시 형식
Unix timestamp를 로컬 시간으로 변환

```typescript
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 예시
formatDate(1704067200000); // "2024.01.01"
```

## 6. 실시간 업데이트 메커니즘

### 현재 구현 (Polling)
```typescript
// components/racer/leaderboard.tsx
useEffect(() => {
  const fetchRacers = async () => {
    const response = await fetch(`/api/racers/${league}`, {
      cache: 'no-store',
    });
    const result = await response.json();
    if (result.success) {
      setRacers(result.data);
    }
  };

  fetchRacers();
  const interval = setInterval(fetchRacers, 3000); // 3초마다 갱신

  return () => clearInterval(interval);
}, [league]);
```

**특징**:
- 3초 간격으로 레이서 목록 갱신
- `cache: 'no-store'`로 항상 최신 데이터 가져오기
- 변경 사항 감지 시 이벤트 시스템 트리거

### 이벤트 감지 시스템
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

**감지 로직**:
- 이메일 기반 레이서 추적 (Map 사용)
- 순위 변동 감지
- 랩타임 개선 감지
- 신규 참가자 감지
- 첫 완주 감지
- 우선순위가 높은 이벤트 선택하여 표시

### 개선 방안
1. **Server-Sent Events (SSE)**
   - 서버에서 클라이언트로 실시간 푸시
   - 리소스 효율적
   - HTTP/2 지원

2. **WebSocket**
   - 양방향 실시간 통신
   - 즉각적인 업데이트
   - 높은 동시 접속자 처리

## 7. 캐싱 전략

### Next.js 캐싱
```typescript
// Server Components - 자동 캐싱
export default async function LeaguesPage() {
  const leagues = await fetch('/api/leagues', {
    next: { revalidate: 60 } // 60초 캐싱
  });
}

// Client Components - no-store
const response = await fetch('/api/racers/${league}', {
  cache: 'no-store' // 항상 최신 데이터
});
```

### 캐싱 계층
1. **Browser Cache**: 정적 자산 (이미지, CSS, JS)
2. **Next.js Cache**: Server Components 데이터
3. **API Response**: 리그 목록 (60초 TTL)
4. **DynamoDB**: 자동 캐싱 (읽기 성능 향상)

## 8. 에러 처리

### HTTP 상태 코드
- **200 OK**: 성공
- **400 Bad Request**: 잘못된 요청 데이터
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스 없음
- **500 Internal Server Error**: 서버 오류

### 에러 응답
```typescript
// lib/dynamodb.ts
export function apiError(message: string, status: number = 500) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

export function apiSuccess<T>(data: T) {
  return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}
```

## 9. 보안 고려사항

### 인증 (Authentication)
```typescript
// NextAuth.js v5
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401);
  }
  // ...
}
```

- Google OAuth Provider
- Session 기반 인증
- JWT 토큰
- Custom DynamoDB Adapter

### 권한 (Authorization)
- **리그 생성/수정**: 인증된 사용자
- **리그 삭제**: 리그 소유자 (userId 확인)
- **레이서 조회**: 공개 (인증 불필요)
- **레이서 등록/수정**: 공개 (인증 불필요)
- **레이서 일괄 삭제**: 리그 소유자

### 데이터 검증
```typescript
// 이메일 검증
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 리그 코드 검증 (영문, 숫자, 하이픈만 허용)
const leagueCodeRegex = /^[a-zA-Z0-9-]+$/;

// 랩타임 검증 (0 < laptime < 10분)
const isValidLaptime = (time: number) => time > 0 && time < 600000;

// 레이서 이름 검증 (1-50자)
const isValidName = (name: string) => name.length > 0 && name.length <= 50;
```

## 10. 성능 지표

### 목표 성능
- **페이지 로드 시간**: < 2초
- **API 응답 시간**: < 200ms
- **리더보드 갱신**: 3초 간격
- **동시 접속자**: 1000명 이상

### 최적화 전략
1. **Server Components**: 초기 로딩 최적화
2. **Dynamic Import**: 코드 스플리팅
3. **Image Optimization**: next/image 사용
4. **Font Optimization**: next/font 사용
5. **Bundle Size**: Tree shaking, 중복 제거

### 모니터링
- Next.js Analytics
- DynamoDB CloudWatch 메트릭
- AWS Amplify 모니터링
- 에러율 및 응답 시간 추적
