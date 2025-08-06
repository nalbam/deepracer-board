'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardEntry } from '@/lib/types';
import { formatLaptime, getRankIcon } from '@/lib/utils';

interface LeaderBoardProps {
  league: string;
}

export function LeaderBoard({ league }: LeaderBoardProps) {
  const [racers, setRacers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRacers() {
      try {
        const response = await fetch(`/api/racers/${league}`);
        const data = await response.json();
        
        if (data.success) {
          setRacers(data.data || []);
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
  }, [league]);

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
              className="racer-item border rounded-lg p-4 transition-colors"
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
  );
}