'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { League } from '@/lib/types';
import { LeagueCard } from './league-card';

interface LeagueListProps {
  showAll?: boolean;
}

export function LeagueList({ showAll = false }: LeagueListProps) {
  const { data: session } = useSession();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const endpoint = showAll ? '/api/leagues?all=true' : '/api/leagues';
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success) {
          setLeagues(data.data || []);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No leagues found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leagues.map((league) => (
        <LeagueCard
          key={league.league}
          league={league}
          currentUserId={session?.user?.id}
        />
      ))}
    </div>
  );
}