'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pollen, PollenRef } from '@/components/effects/pollen';
import { Popup, PopupRef } from '@/components/effects/popup';
import { Scroll, ScrollRef } from '@/components/effects/scroll';
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
  const [previousRacers, setPreviousRacers] = useState<LeaderboardEntry[]>([]);
  const [popInfo, setPopInfo] = useState<PopInfo>({
    rank: 0,
    header: '',
    message: '',
    footer: '',
  });
  const pollenRef = useRef<PollenRef>(null);
  const popupRef = useRef<PopupRef>(null);
  const scrollRef = useRef<ScrollRef>(null);

  const tada = (rank: number, type: number, racerName: string, laptime: string) => {
    if (racers.length === 0) return;

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

    console.log(`tada ${rank} ${racerName} ${laptime}`);

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
  };

  useEffect(() => {
    async function fetchRacers() {
      try {
        const response = await fetch(`/api/racers/${league}`);
        const data = await response.json();

        if (data.success) {
          const newRacers = data.data || [];

          // 변경 감지
          if (previousRacers.length > 0 && newRacers.length > 0) {
            let rank = 0;
            let type = 0;

            // 새로운 레이서 추가 감지
            if (newRacers.length > previousRacers.length) {
              rank = newRacers.length;
              type = 2; // New Challenger
            } else {
              // 기록 갱신 감지
              for (let i = 0; i < previousRacers.length; i++) {
                if (
                  previousRacers[i].racerName !== newRacers[i].racerName ||
                  previousRacers[i].laptime !== newRacers[i].laptime
                ) {
                  rank = i + 1;
                  type = 1; // New Record
                  break;
                }
              }
            }

            // 이벤트 실행
            if (rank > 0 && rank <= newRacers.length) {
              const racer = newRacers[rank - 1];
              tada(rank, type, racer.racerName, formatLaptime(racer.laptime));
            }
          }

          setPreviousRacers(newRacers);
          setRacers(newRacers);
        }
      } catch (error) {
        console.error('Failed to fetch racers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRacers();

    // 5초마다 자동 새로고침
    const interval = setInterval(fetchRacers, 5000);

    return () => clearInterval(interval);
  }, [league, previousRacers]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (racers.length === 0) return;

      // Enter 키: 1등 Congratulations!
      if (e.key === 'Enter') {
        const firstRacer = racers.find((r) => r.rank === 1);
        if (firstRacer) {
          tada(1, 0, firstRacer.racerName, formatLaptime(firstRacer.laptime));
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