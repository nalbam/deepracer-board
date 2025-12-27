'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Calendar, Trophy } from 'lucide-react';
import { League } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function MyLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyLeagues() {
      try {
        const response = await fetch('/api/leagues');
        const data = await response.json();

        if (data.success) {
          setLeagues(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch my leagues:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyLeagues();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          로딩 중...
        </div>
      </Card>
    );
  }

  if (leagues.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">생성한 리그가 없습니다</h3>
          <p className="text-sm text-muted-foreground mb-4">
            새 리그를 생성하여 대회를 시작하세요
          </p>
          <Button asChild>
            <Link href="/manage/league">리그 생성하기</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {leagues.map((league) => (
        <Card key={league.league} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            {/* League Logo */}
            {league.logo && (
              <div className="flex-shrink-0">
                <Image
                  src={league.logo}
                  alt={league.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain"
                  unoptimized
                />
              </div>
            )}

            {/* League Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1">{league.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                코드: <span className="font-mono">{league.league}</span>
              </p>

              {/* Dates */}
              {(league.dateOpen || league.dateClose) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  {league.dateOpen && <span>{formatDate(league.dateOpen)}</span>}
                  {league.dateOpen && league.dateClose && <span>~</span>}
                  {league.dateClose && <span>{formatDate(league.dateClose)}</span>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/league/${league.league}`}>
                    <Trophy className="w-4 h-4 mr-2" />
                    리더보드
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/manage/racers/${league.league}`}>
                    <Users className="w-4 h-4 mr-2" />
                    레이서 관리
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/manage/league/${league.league}`}>
                    <Settings className="w-4 h-4 mr-2" />
                    리그 수정
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
