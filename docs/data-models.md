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
  dateOpen?: string;        // 시작 날짜 (ISO 8601 형식)
  dateClose?: string;       // 종료 날짜 (ISO 8601 형식)
  dateTZ?: string;          // 시간대 (예: "Asia/Seoul")
  
  // Metadata
  userId: string;           // 생성자 Cognito ID
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
  userId?: string;          // 등록자 Cognito ID
  registered: number;       // 등록 타임스탬프
  modified: number;         // 수정 타임스탬프
}
```

### Timer Session (타이머 세션)
타이머 페이지에서 사용되는 임시 데이터 구조

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
| logo | String | - | S3 로고 URL | "https://s3.../logo.png" |
| dateOpen | String | - | 시작일 | "2024-01-01T00:00:00Z" |
| dateClose | String | - | 종료일 | "2024-01-31T23:59:59Z" |
| dateTZ | String | - | 시간대 | "Asia/Seoul" |
| userId | String | - | 생성자 ID | "cognito-user-id-123" |
| registered | Number | - | 생성 시간 | 1704067200000 |
| modified | Number | - | 수정 시간 | 1704067200000 |

**Global Secondary Indexes**: 없음

### deepracer-board-racers 테이블

| 속성 | 타입 | 키 타입 | 설명 | 예시 |
|------|------|---------|------|------|
| league | String | Partition Key | 리그 코드 | "2024-winter" |
| email | String | Sort Key | 레이서 이메일 | "racer@example.com" |
| racerName | String | - | 표시 이름 | "SpeedRacer" |
| laptime | Number | - | 랩타임 (ms) | 65432 |
| userId | String | - | 등록자 ID | "cognito-user-id-456" |
| registered | Number | - | 등록 시간 | 1704067200000 |
| modified | Number | - | 수정 시간 | 1704067200000 |

**Global Secondary Indexes**: 없음

## 3. REST API 엔드포인트

### Leagues API

#### 1. 사용자 리그 목록 조회
```http
GET /items
Authorization: Bearer {token}

Response 200:
[
  {
    "league": "2024-winter",
    "title": "2024 Winter Championship",
    "logo": "https://s3.../logo.png",
    "dateOpen": "2024-01-01T00:00:00Z",
    "dateClose": "2024-01-31T23:59:59Z",
    "userId": "user-123"
  }
]
```

#### 2. 전체 리그 목록 조회
```http
GET /items/all

Response 200:
[
  {
    "league": "2024-winter",
    "title": "2024 Winter Championship",
    "logo": "https://s3.../logo.png"
  },
  {
    "league": "2024-spring",
    "title": "2024 Spring Tournament",
    "logo": "https://s3.../logo2.png"
  }
]
```

#### 3. 특정 리그 조회
```http
GET /items/object/{league}

Response 200:
{
  "league": "2024-winter",
  "title": "2024 Winter Championship",
  "logo": "https://s3.../logo.png",
  "dateOpen": "2024-01-01T00:00:00Z",
  "dateClose": "2024-01-31T23:59:59Z",
  "dateTZ": "Asia/Seoul",
  "userId": "user-123",
  "registered": 1704067200000,
  "modified": 1704067200000
}

Response 404:
{
  "error": "League not found"
}
```

#### 4. 리그 생성/수정
```http
POST /items
Authorization: Bearer {token}
Content-Type: application/json

{
  "league": "2024-winter",
  "title": "2024 Winter Championship",
  "logo": "https://s3.../logo.png",
  "dateOpen": "2024-01-01T00:00:00Z",
  "dateClose": "2024-01-31T23:59:59Z",
  "dateTZ": "Asia/Seoul"
}

Response 200:
{
  "success": true,
  "league": "2024-winter"
}

Response 400:
{
  "error": "Invalid league data"
}
```

#### 5. 리그 삭제
```http
DELETE /items/object/{league}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "League deleted"
}

Response 403:
{
  "error": "Unauthorized to delete this league"
}
```

### Racers API

#### 1. 리그별 레이서 목록 조회
```http
GET /items/{league}

Response 200:
[
  {
    "league": "2024-winter",
    "email": "racer1@example.com",
    "racerName": "SpeedRacer",
    "laptime": 65432,
    "registered": 1704067200000,
    "modified": 1704067200000
  },
  {
    "league": "2024-winter",
    "email": "racer2@example.com",
    "racerName": "Lightning",
    "laptime": 67890,
    "registered": 1704067200000,
    "modified": 1704067200000
  }
]
```

#### 2. 특정 레이서 조회
```http
GET /items/object/{league}/{email}

Response 200:
{
  "league": "2024-winter",
  "email": "racer1@example.com",
  "racerName": "SpeedRacer",
  "laptime": 65432,
  "userId": "user-456",
  "registered": 1704067200000,
  "modified": 1704067200000
}

Response 404:
{
  "error": "Racer not found"
}
```

#### 3. 레이서 생성/수정
```http
POST /items
Content-Type: application/json

{
  "league": "2024-winter",
  "email": "racer@example.com",
  "racerName": "NewRacer",
  "laptime": 70000
}

Response 200:
{
  "success": true,
  "racer": {
    "league": "2024-winter",
    "email": "racer@example.com",
    "racerName": "NewRacer",
    "laptime": 70000
  }
}

Response 400:
{
  "error": "Invalid racer data"
}
```

#### 4. 레이서 삭제
```http
POST /items
Content-Type: application/json

{
  "league": "2024-winter",
  "email": "racer@example.com",
  "forceDelete": true
}

Response 200:
{
  "success": true,
  "message": "Racer deleted"
}
```

또는

```http
DELETE /items/object/{league}/{email}

Response 200:
{
  "success": true,
  "message": "Racer deleted"
}
```

## 4. 비즈니스 로직

### 랩타임 업데이트 규칙
1. **최고 기록 보존**: 새로운 랩타임이 기존 기록보다 느린 경우, 기존 최고 기록을 유지
2. **신기록 갱신**: 새로운 랩타임이 더 빠른 경우에만 업데이트
3. **최초 기록**: 랩타임이 없는 경우 무조건 저장

```javascript
// 랩타임 업데이트 로직
if (!existingRacer.laptime || newLaptime < existingRacer.laptime) {
  // 신기록이거나 최초 기록인 경우만 업데이트
  existingRacer.laptime = newLaptime;
  existingRacer.modified = Date.now();
}
```

### 리더보드 정렬 규칙
1. **기본 정렬**: 랩타임 오름차순 (빠른 시간이 상위)
2. **동일 시간**: 등록 시간 기준 오름차순 (먼저 등록한 사람이 상위)
3. **랩타임 없음**: 목록 하단에 표시

```javascript
racers.sort((a, b) => {
  if (!a.laptime) return 1;
  if (!b.laptime) return -1;
  if (a.laptime === b.laptime) {
    return a.registered - b.registered;
  }
  return a.laptime - b.laptime;
});
```

### 권한 관리
1. **리그 수정/삭제**: 리그 생성자(userId)만 가능
2. **레이서 등록**: 누구나 가능 (인증 불필요)
3. **레이서 수정/삭제**: 관리 페이지 접근 권한 필요

## 5. 시간 형식 변환

### 랩타임 표시 형식
밀리초를 MM:SS.mmm 형식으로 변환

```javascript
function formatLaptime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// 예시
formatLaptime(65432);  // "1:05.432"
formatLaptime(123456); // "2:03.456"
```

### 날짜 표시 형식
ISO 8601을 로컬 시간으로 변환

```javascript
function formatDate(isoString, timezone) {
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    timeZone: timezone || 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

## 6. 실시간 업데이트 메커니즘

### 현재 구현 (Polling)
- 5초 간격으로 레이서 목록 갱신
- 클라이언트 사이드에서 setInterval 사용
- 변경 사항 감지 시 UI 업데이트

### 개선 방안 (Next.js)
1. **Server-Sent Events (SSE)**
   - 서버에서 클라이언트로 단방향 실시간 통신
   - 리소스 효율적

2. **WebSocket**
   - 양방향 실시간 통신
   - 즉각적인 업데이트 가능

3. **Long Polling**
   - HTTP 기반 실시간 통신
   - 방화벽 친화적

## 7. 캐싱 전략

### 데이터 캐싱 계층
1. **브라우저 캐시**: 정적 자산 (이미지, 폰트)
2. **CloudFront CDN**: 정적 콘텐츠 배포
3. **API 응답 캐시**: 리그 목록 (TTL: 60초)
4. **DynamoDB 읽기 캐시**: DAX 사용 가능

### 캐시 무효화
- 리그 정보 변경 시: `/leagues/*` 캐시 무효화
- 레이서 정보 변경 시: `/racers/{league}` 캐시 무효화
- 수동 무효화: CloudFront Invalidation API

## 8. 에러 처리

### HTTP 상태 코드
- **200 OK**: 성공
- **400 Bad Request**: 잘못된 요청 데이터
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스 없음
- **409 Conflict**: 중복 데이터
- **500 Internal Server Error**: 서버 오류

### 에러 응답 형식
```json
{
  "error": "Error message for display",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

## 9. 보안 고려사항

### 인증 (Authentication)
- AWS Cognito User Pool 사용
- JWT 토큰 기반 인증
- 토큰 만료 시간: 1시간

### 권한 (Authorization)
- 리그 생성/수정: 인증된 사용자
- 리그 삭제: 리그 소유자
- 레이서 조회: 공개
- 레이서 수정: 인증된 사용자

### 데이터 검증
```javascript
// 이메일 검증
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 리그 코드 검증 (영문, 숫자, 하이픈만 허용)
const leagueCodeRegex = /^[a-zA-Z0-9-]+$/;

// 랩타임 검증 (0 < laptime < 10분)
const isValidLaptime = (time) => time > 0 && time < 600000;
```

### Rate Limiting
- API Gateway 레벨: 분당 1000 요청
- 사용자별: 분당 100 요청
- 리더보드 조회: 초당 10 요청

## 10. 성능 지표

### 목표 성능
- **페이지 로드 시간**: < 2초
- **API 응답 시간**: < 200ms
- **리더보드 갱신**: 5초 이내
- **동시 접속자**: 1000명 이상

### 모니터링 메트릭
- API 응답 시간
- DynamoDB 읽기/쓰기 용량
- Lambda 함수 실행 시간
- CloudFront 캐시 히트율
- 에러율