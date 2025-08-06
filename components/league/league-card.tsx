import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { League } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface LeagueCardProps {
  league: League;
}

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link href={`/league/${league.league}`}>
      <Card className="league-card hover:scale-[1.02] transition-all duration-200">
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
      </Card>
    </Link>
  );
}