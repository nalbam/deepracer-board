'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { League } from '@/lib/types';

interface LeagueListProps {
  showAll?: boolean;
}

export function LeagueList({ showAll = false }: LeagueListProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const endpoint = showAll ? '/api/leagues?all=true' : '/api/leagues';
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success) {
          // registered 역순으로 정렬 (최신 등록 순)
          const sortedLeagues = (data.data || []).sort((a: League, b: League) => {
            return b.registered - a.registered;
          });
          setLeagues(sortedLeagues);
        }
      } catch (error) {
        console.error('Failed to fetch leagues:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeagues();
  }, [showAll]);

  if (isLoading) {
    return (
      <div className="lb-items">
        <div className="lb-header lb-rank0 league-header-2col">
          <div>Logo</div>
          <div>Title</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="lb-items">
        <div className="lb-header lb-rank0 league-header-2col">
          <div>Logo</div>
          <div>Title</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
          No leagues found.
        </div>
      </div>
    );
  }

  return (
    <div className="lb-items">
      <div className="lb-header lb-rank0 league-header-2col">
        <div>Logo</div>
        <div>Title</div>
      </div>
      {leagues.map((league) => (
        <div key={league.league} className="lb-row league-row-2col">
          <div>
            <Image
              src={league.logo || '/images/logo-league.png'}
              alt="logo"
              width={40}
              height={40}
              className="icon-logo"
              unoptimized
            />
          </div>
          <div>
            <Link href={`/league/${league.league}`}>
              {league.title}
            </Link>
            <div style={{ fontSize: '16px', color: '#aaa', marginTop: '4px' }}>
              {league.league}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}