# DeepRacer Board - Next.js 마이그레이션 계획

## 1. 마이그레이션 개요

### 목표
- React CRA 기반 애플리케이션을 Next.js 14+ App Router로 전환
- 서버 사이드 렌더링(SSR) 및 정적 생성(SSG) 활용
- 성능 최적화 및 SEO 개선
- 모던 개발 스택 적용

### 예상 일정
- Phase 1: 프로젝트 설정 및 기본 구조 (1주)
- Phase 2: 컴포넌트 마이그레이션 (2주)
- Phase 3: API 및 백엔드 통합 (2주)
- Phase 4: 테스트 및 최적화 (1주)

## 2. 기술 스택 변경

### Frontend
```
현재                    →  마이그레이션 후
React 16.14.0           →  React 18.3+
React Router v6         →  Next.js App Router
React Scripts (CRA)     →  Next.js 14+
Bootstrap 4             →  Tailwind CSS 3.4+
JavaScript              →  TypeScript 5.3+
```

### Backend & Infrastructure
```
AWS Amplify CLI         →  직접 AWS SDK 통합 또는 SST
API Gateway + Lambda    →  Next.js API Routes / Edge Functions
Amplify Hosting         →  Vercel / AWS App Runner / Self-hosted
```

## 3. 프로젝트 구조

### 새로운 디렉토리 구조
```
deepracer-board-next/
├── app/                        # App Router
│   ├── (auth)/                # 인증 그룹
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                # 메인 레이아웃 그룹
│   │   ├── page.tsx           # 홈페이지 (/)
│   │   ├── league/
│   │   │   └── [league]/
│   │   │       └── page.tsx   # 리더보드
│   │   └── timer/
│   │       └── [[...params]]/
│   │           └── page.tsx   # 타이머
│   ├── manage/                # 관리 페이지
│   │   ├── page.tsx
│   │   ├── league/
│   │   │   ├── page.tsx       # 새 리그 생성
│   │   │   └── [league]/
│   │   │       └── page.tsx   # 리그 수정
│   │   └── racers/
│   │       └── [league]/
│   │           └── page.tsx   # 레이서 관리
│   ├── api/                   # API Routes
│   │   ├── leagues/
│   │   │   ├── route.ts
│   │   │   └── [league]/
│   │   │       └── route.ts
│   │   └── racers/
│   │       ├── route.ts
│   │       └── [league]/
│   │           ├── route.ts
│   │           └── [email]/
│   │               └── route.ts
│   ├── layout.tsx             # 루트 레이아웃
│   ├── error.tsx              # 에러 바운더리
│   └── loading.tsx            # 로딩 상태
├── components/                 # 재사용 컴포넌트
│   ├── ui/                   # UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── modal.tsx
│   ├── league/                # 리그 관련 컴포넌트
│   │   ├── league-list.tsx
│   │   ├── league-item.tsx
│   │   ├── league-form.tsx
│   │   └── league-logo.tsx
│   ├── racer/                 # 레이서 관련 컴포넌트
│   │   ├── racer-list.tsx
│   │   ├── racer-item.tsx
│   │   └── racer-form.tsx
│   └── effects/               # 시각 효과 컴포넌트
│       ├── pollen.tsx
│       ├── popup.tsx
│       └── scroll.tsx
├── lib/                        # 유틸리티 및 라이브러리
│   ├── db/                    # 데이터베이스
│   │   ├── dynamodb.ts
│   │   └── schema.ts
│   ├── auth/                  # 인증
│   │   └── cognito.ts
│   ├── storage/               # 스토리지
│   │   └── s3.ts
│   └── utils/                 # 유틸리티
│       ├── format.ts
│       └── constants.ts
├── hooks/                      # 커스텀 훅
│   ├── use-league.ts
│   ├── use-racer.ts
│   └── use-timer.ts
├── types/                      # TypeScript 타입 정의
│   ├── league.ts
│   ├── racer.ts
│   └── api.ts
├── public/                     # 정적 자산
├── styles/                     # 글로벌 스타일
│   └── globals.css
├── next.config.js             # Next.js 설정
├── tailwind.config.ts         # Tailwind 설정
├── tsconfig.json              # TypeScript 설정
└── package.json
```

## 4. 컴포넌트 마이그레이션 전략

### Phase 1: 기본 설정
```bash
# 프로젝트 생성
npx create-next-app@latest deepracer-board-next \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*"

# 추가 패키지 설치
npm install @aws-sdk/client-dynamodb \
  @aws-sdk/client-s3 \
  @aws-sdk/client-cognito-identity-provider \
  @tanstack/react-query \
  zustand \
  react-hook-form \
  zod \
  date-fns \
  clsx \
  tailwind-merge
```

### Phase 2: 컴포넌트 변환

#### 클래스 컴포넌트 → 함수형 컴포넌트
```typescript
// 변환 전 (Class Component)
class LeagueList extends Component {
  state = { items: [] }
  
  componentDidMount() {
    this.fetchLeagues()
  }
  
  render() {
    return <div>{/* ... */}</div>
  }
}

// 변환 후 (Function Component with Hooks)
'use client'

import { useState, useEffect } from 'react'
import { useLeagues } from '@/hooks/use-league'

export function LeagueList() {
  const { leagues, isLoading, error } = useLeagues()
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <div>{/* ... */}</div>
}
```

### Phase 3: 라우팅 변환

#### React Router → App Router
```typescript
// app/league/[league]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLeague, getRacers } from '@/lib/api'
import { LeaderBoard } from '@/components/leaderboard'

type Props = {
  params: { league: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const league = await getLeague(params.league)
  
  if (!league) return { title: 'League Not Found' }
  
  return {
    title: `${league.title} - DeepRacer Board`,
    description: `View the leaderboard for ${league.title}`
  }
}

export default async function LeaguePage({ params }: Props) {
  const league = await getLeague(params.league)
  const racers = await getRacers(params.league)
  
  if (!league) notFound()
  
  return <LeaderBoard league={league} initialRacers={racers} />
}
```

## 5. API Routes 구현

### API 구조
```typescript
// app/api/leagues/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { authMiddleware } from '@/lib/auth/middleware'

const db = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    
    // 로직 구현
    const leagues = await fetchLeagues(all)
    
    return NextResponse.json(leagues)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leagues' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await authMiddleware(request)
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const body = await request.json()
  // 리그 생성 로직
  
  return NextResponse.json({ success: true })
}
```

## 6. 상태 관리

### Zustand Store 구현
```typescript
// stores/use-app-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface League {
  code: string
  title: string
  logo?: string
  dateOpen?: string
  dateClose?: string
}

interface Racer {
  email: string
  racerName: string
  laptime: number
  league: string
}

interface AppStore {
  // State
  leagues: League[]
  racers: Record<string, Racer[]>
  currentLeague: League | null
  
  // Actions
  setLeagues: (leagues: League[]) => void
  setRacers: (league: string, racers: Racer[]) => void
  setCurrentLeague: (league: League | null) => void
  addRacer: (racer: Racer) => void
  updateRacer: (racer: Racer) => void
  deleteRacer: (league: string, email: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      leagues: [],
      racers: {},
      currentLeague: null,
      
      setLeagues: (leagues) => set({ leagues }),
      setRacers: (league, racers) =>
        set((state) => ({
          racers: { ...state.racers, [league]: racers }
        })),
      setCurrentLeague: (league) => set({ currentLeague: league }),
      addRacer: (racer) =>
        set((state) => ({
          racers: {
            ...state.racers,
            [racer.league]: [...(state.racers[racer.league] || []), racer]
          }
        })),
      updateRacer: (racer) =>
        set((state) => ({
          racers: {
            ...state.racers,
            [racer.league]: state.racers[racer.league].map((r) =>
              r.email === racer.email ? racer : r
            )
          }
        })),
      deleteRacer: (league, email) =>
        set((state) => ({
          racers: {
            ...state.racers,
            [league]: state.racers[league].filter((r) => r.email !== email)
          }
        }))
    }),
    {
      name: 'deepracer-storage'
    }
  )
)
```

## 7. 실시간 업데이트

### Server-Sent Events (SSE) 구현
```typescript
// app/api/racers/[league]/stream/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { league: string } }
) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        const racers = await getRacers(params.league)
        const data = `data: ${JSON.stringify(racers)}\n\n`
        controller.enqueue(encoder.encode(data))
      }
      
      // 초기 데이터 전송
      await sendUpdate()
      
      // 5초마다 업데이트
      const interval = setInterval(sendUpdate, 5000)
      
      // 클린업
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

// components/racer/racer-list-realtime.tsx
'use client'

import { useEffect, useState } from 'react'

export function RacerListRealtime({ league, initialRacers }) {
  const [racers, setRacers] = useState(initialRacers)
  
  useEffect(() => {
    const eventSource = new EventSource(`/api/racers/${league}/stream`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setRacers(data)
    }
    
    return () => eventSource.close()
  }, [league])
  
  return <RacerList racers={racers} />
}
```

## 8. 인증 시스템

### NextAuth.js with Cognito
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
})

export { handler as GET, handler as POST }
```

## 9. 환경 변수 설정

### .env.local
```env
# Database
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB Tables
DYNAMODB_LEAGUES_TABLE=deepracer-board-leagues
DYNAMODB_RACERS_TABLE=deepracer-board-racers

# S3 Buckets
S3_LOGOS_BUCKET=deepracer-board-logos
S3_REGION=ap-northeast-2

# Authentication
NEXTAUTH_URL=https://deepracerboard.com
NEXTAUTH_SECRET=your_nextauth_secret
COGNITO_CLIENT_ID=your_cognito_client_id
COGNITO_CLIENT_SECRET=your_cognito_client_secret
COGNITO_ISSUER=https://cognito-idp.region.amazonaws.com/pool_id

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 10. 성능 최적화

### 이미지 최적화
```typescript
// components/league/league-logo.tsx
import Image from 'next/image'

export function LeagueLogo({ logo, title }: { logo?: string; title: string }) {
  return (
    <Image
      src={logo || '/images/default-league-logo.png'}
      alt={title}
      width={200}
      height={200}
      className="rounded-lg shadow-lg"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..."
    />
  )
}
```

### 동적 임포트
```typescript
// 무거운 컴포넌트 지연 로딩
import dynamic from 'next/dynamic'

const Timer = dynamic(() => import('@/components/timer'), {
  loading: () => <TimerSkeleton />,
  ssr: false
})

const QRCode = dynamic(() => import('@/components/qr-code'), {
  ssr: false
})
```

### 캐싱 전략
```typescript
// app/league/[league]/page.tsx
export const revalidate = 60 // 60초마다 재검증

// 또는 on-demand revalidation
import { revalidatePath } from 'next/cache'

export async function updateRacer(racer: Racer) {
  // DB 업데이트
  await updateRacerInDB(racer)
  
  // 캐시 무효화
  revalidatePath(`/league/${racer.league}`)
}
```

## 11. 테스팅 전략

### 유닛 테스트
```typescript
// __tests__/components/racer-item.test.tsx
import { render, screen } from '@testing-library/react'
import { RacerItem } from '@/components/racer/racer-item'

describe('RacerItem', () => {
  it('displays trophy for top 3 racers', () => {
    render(<RacerItem rank={1} racer={mockRacer} />)
    expect(screen.getByRole('img', { name: /trophy/i })).toBeInTheDocument()
  })
  
  it('formats lap time correctly', () => {
    render(<RacerItem rank={4} racer={{ ...mockRacer, laptime: 65432 }} />)
    expect(screen.getByText('1:05.432')).toBeInTheDocument()
  })
})
```

### E2E 테스트
```typescript
// e2e/leaderboard.spec.ts
import { test, expect } from '@playwright/test'

test('displays leaderboard and updates in real-time', async ({ page }) => {
  await page.goto('/league/test-league')
  
  // 초기 로드 확인
  await expect(page.locator('[data-testid="racer-list"]')).toBeVisible()
  
  // 5초 대기 후 업데이트 확인
  await page.waitForTimeout(5000)
  const racerCount = await page.locator('[data-testid="racer-item"]').count()
  expect(racerCount).toBeGreaterThan(0)
})
```

## 12. 배포 전략

### Vercel 배포
```json
// vercel.json
{
  "functions": {
    "app/api/racers/*/stream/route.ts": {
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/racers/:league",
      "destination": "/league/:league"
    }
  ]
}
```

### Docker 컨테이너화
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 의존성 설치
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 빌드
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

## 13. 모니터링 및 분석

### 성능 모니터링
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 에러 트래킹
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

## 14. 마이그레이션 체크리스트

### Phase 1: 준비
- [ ] Next.js 프로젝트 생성
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정
- [ ] ESLint/Prettier 설정
- [ ] 환경 변수 설정

### Phase 2: 기본 구조
- [ ] App Router 구조 설정
- [ ] 레이아웃 컴포넌트 생성
- [ ] 라우팅 구조 구현
- [ ] 에러/로딩 페이지 구현

### Phase 3: 컴포넌트
- [ ] UI 컴포넌트 마이그레이션
- [ ] 페이지 컴포넌트 변환
- [ ] 커스텀 훅 구현
- [ ] 상태 관리 설정

### Phase 4: 백엔드
- [ ] API Routes 구현
- [ ] DynamoDB 연동
- [ ] S3 연동
- [ ] 인증 시스템 구현

### Phase 5: 기능
- [ ] 리그 CRUD 구현
- [ ] 레이서 CRUD 구현
- [ ] 실시간 업데이트 구현
- [ ] 타이머 기능 구현

### Phase 6: 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 캐싱 전략 구현
- [ ] SEO 최적화

### Phase 7: 테스트
- [ ] 유닛 테스트 작성
- [ ] 통합 테스트 작성
- [ ] E2E 테스트 작성
- [ ] 성능 테스트

### Phase 8: 배포
- [ ] 빌드 최적화
- [ ] 배포 파이프라인 설정
- [ ] 모니터링 설정
- [ ] 프로덕션 배포

## 15. 예상 문제점 및 해결 방안

### 1. AWS Amplify 의존성 제거
**문제**: Amplify CLI에 깊게 의존된 구조
**해결**: AWS SDK 직접 사용 또는 SST(Serverless Stack) 도입

### 2. 실시간 업데이트
**문제**: 5초 폴링 → 서버 부하
**해결**: SSE 또는 WebSocket 구현

### 3. 인증 시스템 전환
**문제**: Amplify Auth → NextAuth 마이그레이션
**해결**: 점진적 마이그레이션, 세션 호환성 유지

### 4. 클라이언트 사이드 로직
**문제**: 많은 클라이언트 사이드 로직
**해결**: Server Components 활용, 점진적 서버 이동

### 5. 파일 업로드
**문제**: S3 직접 업로드 구현
**해결**: Presigned URL 또는 Next.js API Routes 활용