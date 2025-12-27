'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, Users, Trophy } from 'lucide-react';
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
          // registered 역순으로 정렬 (최신 등록 순)
          const sortedLeagues = (data.data || []).sort((a: League, b: League) => {
            return (b.registered || 0) - (a.registered || 0);
          });
          setLeagues(sortedLeagues);
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
      <div className="manage-empty">
        로딩 중...
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="manage-empty">
        <Trophy className="w-16 h-16 mx-auto mb-4" style={{ opacity: 0.3 }} />
        <h3 className="manage-empty-title">생성한 리그가 없습니다</h3>
        <p className="manage-empty-description">
          새 리그를 생성하여 대회를 시작하세요
        </p>
        <Link href="/manage/league" className="btn-link btn-primary">
          리그 생성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="my-leagues-list">
      {leagues.map((league) => (
        <div key={league.league} className="my-league-card">
          {/* League Logo */}
          {league.logo && (
            <div className="my-league-logo">
              <Image
                src={league.logo}
                alt={league.title}
                width={100}
                height={100}
                className="league-logo-img"
                unoptimized
              />
            </div>
          )}

          {/* League Info */}
          <div className="my-league-info">
            <h3 className="my-league-title">{league.title}</h3>
            <p className="my-league-code">
              코드: <span>{league.league}</span>
            </p>

            {/* Dates */}
            {(league.dateOpen || league.dateClose) && (
              <p className="my-league-dates">
                {league.dateOpen && <span>{formatDate(league.dateOpen)}</span>}
                {league.dateOpen && league.dateClose && <span> ~ </span>}
                {league.dateClose && <span>{formatDate(league.dateClose)}</span>}
              </p>
            )}

            {/* Action Buttons */}
            <div className="my-league-actions">
              <Link href={`/league/${league.league}`} className="btn-link btn-secondary">
                <Trophy className="w-4 h-4" />
                <span>리더보드</span>
              </Link>
              <Link href={`/manage/racers/${league.league}`} className="btn-link btn-secondary">
                <Users className="w-4 h-4" />
                <span>레이서 관리</span>
              </Link>
              <Link href={`/manage/league/${league.league}`} className="btn-link btn-secondary">
                <Settings className="w-4 h-4" />
                <span>리그 수정</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
