'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pollen, PollenRef } from '@/components/effects/pollen';
import { Scroll } from '@/components/effects/scroll';
import { LeaderboardEntry } from '@/lib/types';
import { formatLaptime, getRankIcon } from '@/lib/utils';

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
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded h-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (racers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No racers registered yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* 시각 효과 컴포넌트 */}
      <Pollen ref={pollenRef} />
      <Scroll items={racers.filter(r => r.rank > 0).length} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏁 Leaderboard
            <span className="text-sm font-normal text-muted-foreground">
              ({racers.filter(r => r.rank > 0).length} racers)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {racers.map((racer) => (
              <div
                key={racer.email}
                className={`racer-item border rounded-lg p-4 transition-colors ${racer.rank > 0 ? `lb-rank${racer.rank}` : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-12">
                      {racer.rank > 0 ? (
                        <>
                          <span className="text-xl">
                            {getRankIcon(racer.rank) || `#${racer.rank}`}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{racer.racerName}</p>
                      <p className="text-sm text-muted-foreground">{racer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="laptime-display font-bold">
                      {formatLaptime(racer.laptime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}