'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pollen, PollenRef } from '@/components/effects/pollen';
import { Scroll } from '@/components/effects/scroll';
import { LeaderboardEntry } from '@/lib/types';
import { formatLaptime } from '@/lib/utils';

interface LeaderBoardProps {
  league: string;
}

export function LeaderBoard({ league }: LeaderBoardProps) {
  const [racers, setRacers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bestLaptime, setBestLaptime] = useState<number | null>(null);
  const pollenRef = useRef<PollenRef>(null);

  useEffect(() => {
    async function fetchRacers() {
      try {
        const response = await fetch(`/api/racers/${league}`);
        const data = await response.json();

        if (data.success) {
          const newRacers = data.data || [];

          // 신기록 체크
          if (newRacers.length > 0) {
            const currentBest = newRacers.find((r: LeaderboardEntry) => r.rank === 1);
            if (currentBest && currentBest.laptime > 0) {
              if (bestLaptime === null || currentBest.laptime < bestLaptime) {
                // 신기록 달성!
                setBestLaptime(currentBest.laptime);
                if (bestLaptime !== null && pollenRef.current) {
                  // 최초 로드가 아닐 때만 애니메이션 실행
                  pollenRef.current.start(3000); // 3초 동안 애니메이션
                }
              }
            }
          }

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
  }, [league, bestLaptime]);

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
      <Scroll items={racers.filter(r => r.rank > 0).length} />

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
              {racer.rank > 0 && racer.rank < 4 && (
                <Image
                  src="/images/icon-trophy.png"
                  alt="trophy"
                  width={26}
                  height={26}
                  className="icon-trophy"
                />
              )}{' '}
              {racer.rank > 0 ? racer.rank : '--'}
            </div>
            <div>{racer.racerName}</div>
            <div>{formatLaptime(racer.laptime)}</div>
          </div>
        ))}
      </div>
    </>
  );
}