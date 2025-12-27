'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pollen, PollenRef } from '@/components/effects/pollen';
import { Popup, PopupRef } from '@/components/effects/popup';
import { Scroll, ScrollRef } from '@/components/effects/scroll';
import { LogoPopup, LogoPopupRef } from '@/components/effects/logo-popup';
import { LeaderboardEntry } from '@/lib/types';
import { formatLaptime } from '@/lib/utils';

interface LeaderBoardProps {
  league: string;
}

interface PopInfo {
  rank: number;
  header: string;
  message: string;
  footer: string;
}

// 이벤트 타입 정의
enum EventType {
  MANUAL = 0,           // 수동 트리거 (Enter)
  CHAMPION_RECORD = 1,  // 챔피언 기록 갱신
  NEW_CHAMPION = 2,     // 새 챔피언 탄생
  TOP3_ENTRY = 3,       // Top 3 진입
  RECORD_UPDATE = 4,    // 일반 기록 갱신
  FIRST_LAP = 5,        // 첫 완주
  NEW_RACER = 6,        // 신규 참가자
}

// 이벤트별 헤더
const EVENT_HEADERS: Record<EventType, string> = {
  [EventType.MANUAL]: 'Congratulations!',
  [EventType.CHAMPION_RECORD]: 'Unbeatable!',
  [EventType.NEW_CHAMPION]: 'Champion!',
  [EventType.TOP3_ENTRY]: 'Top 3!',
  [EventType.RECORD_UPDATE]: 'New Record!',
  [EventType.FIRST_LAP]: 'First Lap!',
  [EventType.NEW_RACER]: 'New Challenger!',
};

// 이벤트별 우선순위
const EVENT_PRIORITY: Record<EventType, number> = {
  [EventType.MANUAL]: 0,          // 수동은 우선순위 없음
  [EventType.NEW_CHAMPION]: 10,   // 최우선
  [EventType.CHAMPION_RECORD]: 8,
  [EventType.TOP3_ENTRY]: 6,
  [EventType.FIRST_LAP]: 4,
  [EventType.NEW_RACER]: 4,
  [EventType.RECORD_UPDATE]: 2,
};

// 감지된 이벤트 정보
interface DetectedEvent {
  type: EventType;
  rank: number;
  racerName: string;
  laptime: number;
  priority: number;
}

export function LeaderBoard({ league }: LeaderBoardProps) {
  const [racers, setRacers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousRacersRef = useRef<LeaderboardEntry[]>([]);
  const [popInfo, setPopInfo] = useState<PopInfo>({
    rank: 0,
    header: '',
    message: '',
    footer: '',
  });
  const [leagueInfo, setLeagueInfo] = useState<{ logo?: string; title?: string }>({});
  const pollenRef = useRef<PollenRef>(null);
  const popupRef = useRef<PopupRef>(null);
  const scrollRef = useRef<ScrollRef>(null);
  const logoPopupRef = useRef<LogoPopupRef>(null);

  const tada = (rank: number, eventType: EventType, racerName: string, laptime: string) => {
    const header = EVENT_HEADERS[eventType];

    setPopInfo({
      rank,
      header,
      message: racerName,
      footer: laptime,
    });

    // 이벤트별 이펙트 설정
    let duration = 5000;        // 기본 5초
    let pollenIntensity = 5000; // 기본 강도
    let showLogo = false;
    let soundFile = '';

    switch (eventType) {
      case EventType.NEW_CHAMPION:
        duration = 8000;
        pollenIntensity = 8000;
        showLogo = true;
        soundFile = '/sounds/fanfare.mp3';
        break;
      case EventType.CHAMPION_RECORD:
        duration = 6000;
        pollenIntensity = 6000;
        soundFile = '/sounds/ding1.mp3';
        break;
      case EventType.TOP3_ENTRY:
        duration = 5000;
        pollenIntensity = 5000;
        soundFile = '/sounds/ding2.mp3';
        break;
      case EventType.RECORD_UPDATE:
        duration = 4000;
        pollenIntensity = 4000;
        soundFile = '/sounds/ding1.mp3';
        break;
      case EventType.FIRST_LAP:
        duration = 4000;
        pollenIntensity = 4000;
        soundFile = '/sounds/ding2.mp3';
        break;
      case EventType.NEW_RACER:
        duration = 4000;
        pollenIntensity = 4000;
        soundFile = '/sounds/ding2.mp3';
        break;
      case EventType.MANUAL:
        duration = 5000;
        pollenIntensity = 5000;
        showLogo = true;
        soundFile = '/sounds/fanfare.mp3';
        break;
    }

    // 리그 로고 표시 (새 챔피언 또는 수동 트리거)
    if (showLogo && logoPopupRef.current) {
      // Show league logo first
      logoPopupRef.current.start(3000);

      // Start racer popup at 2.7s (when logo starts fading out) for smooth crossfade
      setTimeout(() => {
        // Scroll to rank
        if (scrollRef.current) {
          scrollRef.current.scroll(rank);
        }

        // Start pollen effect
        if (pollenRef.current) {
          pollenRef.current.start(pollenIntensity);
        }

        // Start popup (crossfades with logo fadeout)
        if (popupRef.current) {
          popupRef.current.start(duration);
        }

        // Play sound
        if (soundFile) {
          const audio = new Audio(soundFile);
          audio.loop = false;
          audio.play().catch(() => {
            // Ignore audio play errors
          });
        }
      }, 2700);
    } else {
      // Normal behavior without logo
      // Scroll to rank
      if (scrollRef.current) {
        scrollRef.current.scroll(rank);
      }

      // Start pollen effect
      if (pollenRef.current) {
        pollenRef.current.start(pollenIntensity);
      }

      // Start popup
      if (popupRef.current) {
        popupRef.current.start(duration);
      }

      // Play sound
      if (soundFile) {
        const audio = new Audio(soundFile);
        audio.loop = false;
        audio.play().catch(() => {
          // Ignore audio play errors
        });
      }
    }
  };

  // Fetch league info
  useEffect(() => {
    async function fetchLeagueInfo() {
      try {
        const response = await fetch(`/api/leagues/${league}`);
        const data = await response.json();
        if (data.success && data.data) {
          setLeagueInfo({
            logo: data.data.logo,
            title: data.data.title,
          });
        }
      } catch (error) {
        console.error('Failed to fetch league info:', error);
      }
    }

    fetchLeagueInfo();
  }, [league]);

  useEffect(() => {
    async function fetchRacers() {
      try {
        const response = await fetch(`/api/racers/${league}`);
        const data = await response.json();

        if (data.success) {
          const newRacers = data.data || [];
          const previousRacers = previousRacersRef.current;

          // 이벤트 감지 (이메일 기반)
          if (previousRacers.length > 0) {
            const detectedEvents: DetectedEvent[] = [];

            // 이전 레이서들을 Map으로 변환 (email -> racer)
            const previousMap = new Map(
              previousRacers.map(r => [r.email, r])
            );

            // 각 레이서마다 이벤트 감지
            for (const newRacer of newRacers) {
              // rank가 0이면 기록 없는 레이서이므로 무시
              if (newRacer.rank === 0) continue;

              const prevRacer = previousMap.get(newRacer.email);

              if (!prevRacer) {
                // 신규 참가자 - 순위에 따라 세분화
                if (newRacer.rank === 1) {
                  // 신규 참가자가 바로 1등 → 새 챔피언!
                  detectedEvents.push({
                    type: EventType.NEW_CHAMPION,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.NEW_CHAMPION],
                  });
                } else if (newRacer.rank >= 2 && newRacer.rank <= 3) {
                  // 신규 참가자가 바로 Top 3 진입
                  detectedEvents.push({
                    type: EventType.TOP3_ENTRY,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.TOP3_ENTRY],
                  });
                } else {
                  // 이벤트 6: 일반 신규 참가자
                  detectedEvents.push({
                    type: EventType.NEW_RACER,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.NEW_RACER],
                  });
                }
              } else if (prevRacer.rank === 0 && newRacer.rank > 0) {
                // 첫 완주 - 순위에 따라 세분화
                if (newRacer.rank === 1) {
                  // 첫 완주로 1등 달성 → 새 챔피언!
                  detectedEvents.push({
                    type: EventType.NEW_CHAMPION,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.NEW_CHAMPION],
                  });
                } else if (newRacer.rank >= 2 && newRacer.rank <= 3) {
                  // 첫 완주로 Top 3 진입
                  detectedEvents.push({
                    type: EventType.TOP3_ENTRY,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.TOP3_ENTRY],
                  });
                } else {
                  // 이벤트 5: 일반 첫 완주
                  detectedEvents.push({
                    type: EventType.FIRST_LAP,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.FIRST_LAP],
                  });
                }
              } else if (prevRacer.rank > 0 && prevRacer.laptime > newRacer.laptime) {
                // 기록 갱신 - 이제 세분화된 감지

                // 이벤트 2: 새 챔피언 탄생 (2등 이하 → 1등)
                if (prevRacer.rank > 1 && newRacer.rank === 1) {
                  detectedEvents.push({
                    type: EventType.NEW_CHAMPION,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.NEW_CHAMPION],
                  });
                }
                // 이벤트 1: 챔피언 기록 갱신 (1등이 자신의 기록 개선)
                else if (prevRacer.rank === 1 && newRacer.rank === 1) {
                  detectedEvents.push({
                    type: EventType.CHAMPION_RECORD,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.CHAMPION_RECORD],
                  });
                }
                // 이벤트 3: Top 3 진입 (4등 이하 → 2-3등)
                else if (prevRacer.rank > 3 && newRacer.rank >= 2 && newRacer.rank <= 3) {
                  detectedEvents.push({
                    type: EventType.TOP3_ENTRY,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.TOP3_ENTRY],
                  });
                }
                // 이벤트 4: 일반 기록 갱신
                else {
                  detectedEvents.push({
                    type: EventType.RECORD_UPDATE,
                    rank: newRacer.rank,
                    racerName: newRacer.racerName,
                    laptime: newRacer.laptime,
                    priority: EVENT_PRIORITY[EventType.RECORD_UPDATE],
                  });
                }
              }
            }

            // 우선순위 기반 필터링: 가장 높은 우선순위 이벤트만 선택
            if (detectedEvents.length > 0) {
              // 우선순위로 정렬 (높은 것부터)
              detectedEvents.sort((a, b) => {
                if (b.priority !== a.priority) {
                  return b.priority - a.priority;
                }
                // 같은 우선순위면 더 높은 순위(rank가 낮은) 레이서 우선
                return a.rank - b.rank;
              });

              // 가장 높은 우선순위 이벤트 실행
              const topEvent = detectedEvents[0];
              tada(
                topEvent.rank,
                topEvent.type,
                topEvent.racerName,
                formatLaptime(topEvent.laptime)
              );
            }
          }

          previousRacersRef.current = newRacers;
          setRacers(newRacers);
        }
      } catch (error) {
        console.error('Failed to fetch racers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRacers();

    // 3초마다 자동 새로고침
    const interval = setInterval(fetchRacers, 3000);

    return () => clearInterval(interval);
  }, [league]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (racers.length === 0) return;

      // Enter 키: 1등 Congratulations! (리그 로고 표시)
      if (e.key === 'Enter') {
        const firstRacer = racers.find((r) => r.rank === 1);
        if (firstRacer) {
          tada(1, EventType.MANUAL, firstRacer.racerName, formatLaptime(firstRacer.laptime));
        }
      }
      // 숫자 1 키: 1등 Champion!
      else if (e.key === '1') {
        const firstRacer = racers.find((r) => r.rank === 1);
        if (firstRacer) {
          tada(1, EventType.NEW_CHAMPION, firstRacer.racerName, formatLaptime(firstRacer.laptime));
        }
      }
      // 숫자 2 키: 2등 Top 3!
      else if (e.key === '2') {
        const secondRacer = racers.find((r) => r.rank === 2);
        if (secondRacer) {
          tada(2, EventType.TOP3_ENTRY, secondRacer.racerName, formatLaptime(secondRacer.laptime));
        }
      }
      // 숫자 3 키: 3등 Top 3!
      else if (e.key === '3') {
        const thirdRacer = racers.find((r) => r.rank === 3);
        if (thirdRacer) {
          tada(3, EventType.TOP3_ENTRY, thirdRacer.racerName, formatLaptime(thirdRacer.laptime));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [racers]);

  if (isLoading) {
    return (
      <div className="lb-items">
        <div className="lb-header lb-rank0">
          <div>Rank</div>
          <div>Name</div>
          <div>Time</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (racers.length === 0) {
    return (
      <div className="lb-items">
        <div className="lb-header lb-rank0">
          <div>Rank</div>
          <div>Name</div>
          <div>Time</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
          No racers registered yet.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 시각 효과 컴포넌트 */}
      <Pollen ref={pollenRef} />
      <LogoPopup ref={logoPopupRef} logoUrl={leagueInfo.logo} leagueTitle={leagueInfo.title} />
      <Popup ref={popupRef} popInfo={popInfo} />
      <Scroll ref={scrollRef} items={racers.filter(r => r.rank > 0).length} />

      <div className="lb-items">
        <div className="lb-header lb-rank0">
          <div>Rank</div>
          <div>Name</div>
          <div>Time</div>
        </div>
        {racers.map((racer) => (
          <div
            key={racer.email}
            className={`lb-row ${racer.rank > 0 ? `lb-rank${racer.rank}` : ''}`}
          >
            <div>
              {racer.rank > 0 && racer.rank < 4 ? (
                <Image
                  src="/images/icon-trophy.png"
                  alt="trophy"
                  width={26}
                  height={26}
                  className="icon-trophy"
                />
              ) : (
                <span></span>
              )}
              <span>{racer.rank > 0 ? racer.rank : '--'}</span>
            </div>
            <div>{racer.racerName}</div>
            <div className="laptime">{formatLaptime(racer.laptime)}</div>
          </div>
        ))}
      </div>
    </>
  );
}