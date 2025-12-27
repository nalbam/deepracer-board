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

  const tada = (rank: number, type: number, racerName: string, laptime: string, showLogo: boolean = false) => {
    let header;
    if (type === 1) {
      header = 'New Record!';
    } else if (type === 2) {
      header = 'New Challenger!';
    } else {
      header = 'Congratulations!';
    }

    setPopInfo({
      rank,
      header,
      message: racerName,
      footer: laptime,
    });

    // If showLogo is true, show logo first, then racer info
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
          pollenRef.current.start(5000);
        }

        // Start popup (crossfades with logo fadeout)
        if (popupRef.current) {
          popupRef.current.start(5000);
        }

        // Play fanfare sound
        if (type === 0) {
          const fanfare = new Audio('/sounds/fanfare.mp3');
          fanfare.loop = false;
          fanfare.play().catch(() => {
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
        pollenRef.current.start(5000);
      }

      // Start popup
      if (popupRef.current) {
        popupRef.current.start(5000);
      }

      // Play fanfare sound for manual trigger (type 0)
      if (type === 0) {
        const fanfare = new Audio('/sounds/fanfare.mp3');
        fanfare.loop = false;
        fanfare.play().catch(() => {
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

          // 변경 감지 (이메일 기반)
          if (previousRacers.length > 0) {
            // 이전 레이서들을 Map으로 변환 (email -> racer)
            const previousMap = new Map(
              previousRacers.map(r => [r.email, r])
            );

            // 새 레이서와 기록 갱신 감지
            for (const newRacer of newRacers) {
              // rank가 0이면 기록 없는 레이서이므로 무시
              if (newRacer.rank === 0) continue;

              const prevRacer = previousMap.get(newRacer.email);

              if (!prevRacer) {
                // 새로운 레이서 추가
                tada(newRacer.rank, 2, newRacer.racerName, formatLaptime(newRacer.laptime));
                break;
              } else if (prevRacer.rank === 0 && newRacer.rank > 0) {
                // 기록 없던 레이서가 첫 랩타임 기록
                tada(newRacer.rank, 2, newRacer.racerName, formatLaptime(newRacer.laptime));
                break;
              } else if (prevRacer.rank > 0 && prevRacer.laptime > newRacer.laptime) {
                // 기록 갱신 (더 빠른 시간)
                tada(newRacer.rank, 1, newRacer.racerName, formatLaptime(newRacer.laptime));
                break;
              }
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

      // Enter 키: 1등 Congratulations! (리그 로고 먼저 표시)
      if (e.key === 'Enter') {
        const firstRacer = racers.find((r) => r.rank === 1);
        if (firstRacer) {
          tada(1, 0, firstRacer.racerName, formatLaptime(firstRacer.laptime), true);
        }
      }
      // 숫자 1 키: 1등 New Record!
      else if (e.key === '1') {
        const firstRacer = racers.find((r) => r.rank === 1);
        if (firstRacer) {
          tada(1, 1, firstRacer.racerName, formatLaptime(firstRacer.laptime));
        }
      }
      // 숫자 2 키: 2등 New Challenger!
      else if (e.key === '2') {
        const secondRacer = racers.find((r) => r.rank === 2);
        if (secondRacer) {
          tada(2, 2, secondRacer.racerName, formatLaptime(secondRacer.laptime));
        }
      }
      // 숫자 3 키: 3등 New Challenger!
      else if (e.key === '3') {
        const thirdRacer = racers.find((r) => r.rank === 3);
        if (thirdRacer) {
          tada(3, 2, thirdRacer.racerName, formatLaptime(thirdRacer.laptime));
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