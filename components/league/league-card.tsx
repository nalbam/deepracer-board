'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { League } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface LeagueCardProps {
  league: League;
  currentUserId?: string;
}

export function LeagueCard({ league, currentUserId }: LeagueCardProps) {
  const isOwner = currentUserId && league.userId === currentUserId;

  return (
    <Card className="league-card hover:scale-[1.02] transition-all duration-200 flex flex-col">
      <Link href={`/league/${league.league}`} className="flex-1">
        <CardHeader className="pb-3">
          {league.logo && (
            <div className="flex justify-center mb-4">
              <Image
                src={league.logo}
                alt={league.title}
                width={80}
                height={80}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          <CardTitle className="text-lg text-center">{league.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <strong>Code:</strong> {league.league}
            </div>
            {league.dateOpen && (
              <div>
                <strong>Start:</strong> {formatDate(league.dateOpen, league.dateTZ)}
              </div>
            )}
            {league.dateClose && (
              <div>
                <strong>End:</strong> {formatDate(league.dateClose, league.dateTZ)}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      {isOwner && (
        <CardFooter className="flex gap-2 pt-0">
          <Link href={`/manage/league/${league.league}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </Link>
          <Link href={`/manage/racers/${league.league}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Manage Racers
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}