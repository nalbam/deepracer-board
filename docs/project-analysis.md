# DeepRacer Board - 프로젝트 분석 문서

## 1. 프로젝트 개요

**DeepRacer Board**는 AWS DeepRacer 레이싱 리그를 관리하고 리더보드를 제공하는 웹 애플리케이션입니다.

### 주요 특징
- 레이싱 리그 생성 및 관리
- 레이서별 랩타임 기록 및 추적
- 실시간 리더보드 순위 표시
- 타이머 기능을 통한 랩타임 측정
- Production URL: https://deepracerboard.com

## 2. 기술 스택

### Frontend
- **React 16.14.0**: 사용자 인터페이스 구축
- **React Router v6**: SPA 라우팅 관리
- **AWS Amplify 5.3.10**: AWS 서비스 통합
- **Bootstrap 4.4.1**: UI 스타일링
- **React Select 5.7.4**: 향상된 드롭다운 컴포넌트
- **React Scripts 5.0.1**: Create React App 기반 빌드 도구

### Backend (AWS Amplify)
- **API Gateway**: REST API 엔드포인트 제공
- **Lambda Functions**: 서버리스 비즈니스 로직
- **DynamoDB**: NoSQL 데이터베이스
- **Cognito**: 사용자 인증 및 권한 관리
- **S3**: 정적 파일 및 로고 저장소
- **CloudFront**: CDN 배포

## 3. 프로젝트 구조

```
deepracer-board/
├── amplify/                    # AWS Amplify 백엔드 설정
│   ├── backend/
│   │   ├── api/               # API Gateway 설정
│   │   │   ├── leagues/       # 리그 API 설정
│   │   │   └── racers/        # 레이서 API 설정
│   │   ├── auth/              # Cognito 인증 설정
│   │   ├── function/          # Lambda 함수
│   │   │   ├── leagues/       # 리그 관리 함수
│   │   │   └── racers/        # 레이서 관리 함수
│   │   ├── storage/           # DynamoDB 및 S3 설정
│   │   └── hosting/           # S3/CloudFront 호스팅 설정
│   └── team-provider-info.json
├── public/                     # 정적 리소스
│   ├── images/                # 이미지 파일
│   ├── sounds/                # 사운드 효과 파일
│   └── fonts/                 # 커스텀 폰트
├── src/
│   ├── component/             # React 컴포넌트
│   ├── pages/                 # 페이지 컴포넌트
│   ├── context/               # React Context API
│   └── config/                # 설정 파일
└── backup/                     # 백업 스크립트
```

## 4. 라우팅 구조

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | App | 메인 페이지 (전체 리그 목록) |
| `/racers/:league` | Leaderboard | 리그별 리더보드 |
| `/league/:league` | Leaderboard | 리그별 리더보드 (대체 경로) |
| `/manage` | Manage | 관리 페이지 진입점 |
| `/manage/league` | ManageLeague | 새 리그 생성 |
| `/manage/league/:league` | ManageLeague | 리그 수정 |
| `/manage/racers/:league` | ManageRacer | 레이서 관리 |
| `/timer` | Timer | 타이머 페이지 |
| `/timer/:min` | Timer | 타이머 페이지 (시간 제한 설정) |

## 5. 주요 컴포넌트

### 페이지 컴포넌트
- **App**: 메인 페이지, 전체 리그 목록 표시
- **Leaderboard**: 특정 리그의 리더보드 표시
- **Manage**: 리그/레이서 관리 진입점
- **ManageLeague**: 리그 CRUD 작업
- **ManageRacer**: 레이서 CRUD 작업
- **Timer**: 랩타임 측정 및 기록

### UI 컴포넌트
- **LeagueAll**: 모든 리그 목록 표시
- **LeagueList**: 사용자의 리그 목록
- **LeagueItem**: 개별 리그 카드
- **LeagueForm**: 리그 생성/수정 폼
- **LeagueHeader**: 리그 헤더 정보
- **LeagueLogo**: 리그 로고 표시
- **RacerList**: 레이서 목록 (5초마다 자동 새로고침)
- **RacerItem**: 개별 레이서 정보 (순위, 이름, 랩타임)
- **RacerForm**: 레이서 생성/수정/삭제 폼
- **Popup**: 신기록/신규 도전자 알림
- **Pollen**: 축하 애니메이션 효과
- **Scroll**: 자동 스크롤 기능
- **QRCode**: 리그 페이지 QR 코드 생성

## 6. API 엔드포인트

### Leagues API
```
GET    /items                    # 사용자의 리그 목록
GET    /items/all               # 모든 리그 목록
GET    /items/object/:league    # 특정 리그 정보
PUT    /items                   # 리그 생성/수정
POST   /items                   # 리그 생성/수정
DELETE /items/object/:league    # 리그 삭제
```

### Racers API
```
GET    /items/:league                    # 리그의 레이서 목록
GET    /items/object/:league/:email     # 특정 레이서 정보
PUT    /items                           # 레이서 생성/수정
POST   /items                           # 레이서 생성/수정/삭제
DELETE /items/object/:league/:email     # 레이서 삭제
```

## 7. 데이터베이스 스키마

### deepracer-board-leagues 테이블
- **Primary Key**: `league` (String) - 리그 코드
- **Attributes**:
  - `title`: 리그 제목
  - `logo`: 로고 URL
  - `dateOpen`: 시작 날짜
  - `dateClose`: 종료 날짜
  - `dateTZ`: 시간대
  - `registered`: 등록 시간
  - `modified`: 수정 시간
  - `userId`: 생성자 ID

### deepracer-board-racers 테이블
- **Primary Key**: `league` (String) - 리그 코드
- **Sort Key**: `email` (String) - 레이서 이메일
- **Attributes**:
  - `racerName`: 레이서 이름
  - `laptime`: 랩타임 (밀리초)
  - `registered`: 등록 시간
  - `modified`: 수정 시간
  - `userId`: 등록자 ID

## 8. 주요 기능

### 리그 관리
- 리그 생성 및 수정
- 리그 제목, 로고, 운영 기간 설정
- 고유한 리그 코드 생성
- 리그 로고 URL 미리보기

### 레이서 관리
- 레이서 등록 및 정보 수정
- 랩타임 기록 및 업데이트
- 최고 기록 자동 보존 (더 느린 기록으로 업데이트 시 기존 최고 기록 유지)
- 레이서 삭제 기능
- 이메일을 통한 고유 식별

### 리더보드
- 랩타임 기준 자동 정렬
- 5초마다 실시간 업데이트
- 상위 3명 트로피 아이콘 표시
- 신기록/신규 도전자 시각 효과
- 자동 스크롤로 모든 참가자 표시

### 타이머
- 밀리초 단위 정밀 측정
- 시간 제한 시각적 표시 (노란색/빨간색 경고)
- 키보드 단축키 지원
- 최고/최근 랩타임 표시
- 랩타임 취소 및 거부 기능
- 신기록 사운드 효과

## 9. 사용자 경험 (UX)

### 시각적 효과
- **Pollen 컴포넌트**: 축하 파티클 애니메이션
- **Popup 컴포넌트**: 신기록/신규 도전자 알림
- **Logo 컴포넌트**: 리그 로고 팝업 효과
- **사운드 효과**: 신기록 달성 시 오디오 피드백
- **자동 스크롤**: 특정 레이서 주목 유도
- **QR 코드**: 모바일 접근성 향상

### 반응형 디자인
- 모바일 친화적 인터페이스
- Bootstrap 4 기반 레이아웃
- 터치 이벤트 지원

## 10. 보안 및 인증

### Cognito 인증
- 사용자 가입/로그인
- 이메일 검증
- 비밀번호 재설정
- 세션 관리

### 권한 관리
- 리그 생성자만 해당 리그 수정 가능
- 인증된 사용자만 리그/레이서 관리
- 공개 리더보드 열람

## 11. 배포 구성

### AWS Amplify 배포
```yaml
# amplify.yml
version: 0.2
backend:
  phases:
    build:
      commands:
        - amplifyPush --simple
frontend:
  phases:
    build:
      commands:
        - npm install
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - "**/*"
```

### 환경 설정
- Production: https://deepracerboard.com
- CloudFront CDN 배포
- S3 정적 호스팅
- HTTPS 지원

## 12. 개발 환경

### 로컬 개발
```bash
npm install     # 의존성 설치
npm start       # 개발 서버 시작 (포트 3000)
npm run build   # 프로덕션 빌드
npm test        # 테스트 실행
```

### 필수 환경 변수
- AWS Amplify 자격 증명
- DynamoDB 테이블 리전
- S3 버킷 설정
- Cognito 풀 ID

## 13. Next.js 마이그레이션 고려사항

### 현재 구조 분석
- **클래스 컴포넌트**: 함수형 컴포넌트로 전환 필요
- **라우팅**: React Router → Next.js App Router
- **상태 관리**: Context API → 유지 또는 Zustand/Redux 고려
- **API 통합**: AWS Amplify → Next.js API Routes 또는 직접 AWS SDK 사용

### 마이그레이션 전략
1. **페이지 구조 변환**
   - pages/ 또는 app/ 디렉토리 구조로 재구성
   - 동적 라우팅 구현 ([league], [email] 등)

2. **서버 사이드 렌더링**
   - getServerSideProps/getStaticProps 활용
   - 리더보드 데이터 사전 로드

3. **API Routes**
   - /api 엔드포인트로 Lambda 함수 대체
   - DynamoDB 직접 연동

4. **인증 시스템**
   - NextAuth.js 또는 AWS Amplify Auth 유지
   - 세션 관리 전략 수립

5. **최적화**
   - Image 컴포넌트 활용
   - 동적 임포트 및 코드 스플리팅
   - ISR (Incremental Static Regeneration) 적용

### 주요 변경 사항
- Bootstrap → Tailwind CSS 고려
- 클래스 컴포넌트 → 함수형 컴포넌트 + Hooks
- AWS Amplify CLI → Vercel/AWS 직접 배포
- webpack 설정 → Next.js 내장 설정

## 14. 성능 최적화 포인트

### 현재 이슈
- 5초마다 전체 레이서 목록 폴링
- 클라이언트 사이드 정렬 및 필터링
- 대용량 리그 시 성능 저하 가능

### 개선 방안
- WebSocket 또는 SSE로 실시간 업데이트
- 서버 사이드 페이지네이션
- 캐싱 전략 구현
- 이미지 최적화 및 lazy loading

## 15. 추가 기능 제안

### 단기 개선
- 다크 모드 지원
- 다국어 지원 (i18n)
- 레이서 프로필 사진
- 랩타임 히스토리

### 장기 로드맵
- 토너먼트 브래킷 시스템
- 실시간 레이스 트래킹
- 통계 대시보드
- 모바일 앱 개발