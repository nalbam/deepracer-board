import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 랩타임을 MM:SS.mmm 형식으로 변환
export function formatLaptime(milliseconds: number | undefined): string {
  if (!milliseconds) return '--:--.---';
  
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// 밀리초를 시간 문자열로 파싱
export function parseLaptime(timeString: string): number | null {
  // MM:SS.mmm 형식 파싱
  const match = timeString.match(/^(\d+):(\d{2})\.(\d{3})$/);
  if (!match) return null;
  
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const milliseconds = parseInt(match[3], 10);
  
  if (seconds >= 60) return null;
  
  return minutes * 60000 + seconds * 1000 + milliseconds;
}

// 날짜를 로컬 시간으로 변환
export function formatDate(date: string | number | Date, timezone?: string): string {
  const d = new Date(date);
  return d.toLocaleString('ko-KR', {
    timeZone: timezone || 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 리그 코드 생성 (URL-safe)
export function generateLeagueCode(title: string): string {
  const timestamp = Date.now().toString(36);
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);
  
  return `${cleanTitle}-${timestamp}`;
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 리그 코드 유효성 검사
export function isValidLeagueCode(code: string): boolean {
  const leagueCodeRegex = /^[a-zA-Z0-9-]+$/;
  return leagueCodeRegex.test(code) && code.length <= 50;
}

// 랩타임 유효성 검사 (0 < laptime < 10분)
export function isValidLaptime(time: number): boolean {
  return time > 0 && time < 600000;
}

// 상대 시간 표시
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}

// 순위별 트로피 아이콘 반환
export function getRankIcon(rank: number): string | null {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return null;
  }
}

// 타이머 상태별 색상 클래스
export function getTimerColorClass(currentTime: number, timeLimit?: number): string {
  if (!timeLimit) return '';
  
  const limitMs = timeLimit * 60000;
  const ratio = currentTime / limitMs;
  
  if (ratio >= 1) return 'text-red-600';
  if (ratio >= 0.8) return 'text-yellow-600';
  return '';
}