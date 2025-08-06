// League 타입 정의
export interface League {
  league: string;           // Primary Key - 리그 고유 코드
  title: string;            // 리그 제목
  logo?: string;            // 로고 이미지 URL
  dateOpen?: string;        // 시작 날짜 (ISO 8601)
  dateClose?: string;       // 종료 날짜 (ISO 8601)
  dateTZ?: string;          // 시간대
  userId: string;           // 생성자 ID
  registered: number;       // 생성 타임스탬프
  modified: number;         // 수정 타임스탬프
}

// Racer 타입 정의
export interface Racer {
  league: string;           // Partition Key - 리그 코드
  email: string;            // Sort Key - 레이서 이메일
  racerName: string;        // 레이서 표시 이름
  laptime: number;          // 최고 랩타임 (밀리초)
  userId?: string;          // 등록자 ID
  registered: number;       // 등록 타임스탬프
  modified: number;         // 수정 타임스탬프
}

// Timer 세션 타입
export interface TimerSession {
  currentTime: number;      // 현재 진행 중인 시간 (밀리초)
  startTime?: number;       // 시작 타임스탬프
  bestTime?: number;        // 세션 내 최고 기록
  lastTime?: number;        // 직전 기록
  laps: number[];          // 전체 랩 기록 배열
  status: 'idle' | 'running' | 'stopped';
  timeLimit?: number;       // 시간 제한 (분)
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 리그 생성/수정 요청 타입
export interface LeagueInput {
  league: string;
  title: string;
  logo?: string;
  dateOpen?: string;
  dateClose?: string;
  dateTZ?: string;
}

// 레이서 생성/수정 요청 타입
export interface RacerInput {
  league: string;
  email: string;
  racerName: string;
  laptime?: number;
  forceDelete?: boolean;  // 삭제 플래그
}

// 리더보드 항목 타입 (순위 포함)
export interface LeaderboardEntry extends Racer {
  rank: number;
  isNewRecord?: boolean;
  isNewChallenger?: boolean;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  lastLogin: number;
  createdAt: number;
  updatedAt: number;
}