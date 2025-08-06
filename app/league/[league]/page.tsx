import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderBoard } from '@/components/racer/leaderboard';
import { League } from '@/lib/types';

type Props = {
  params: { league: string };
};

async function getLeague(leagueCode: string): Promise<League | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/leagues/${leagueCode}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch league:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const league = await getLeague(params.league);
  
  if (!league) {
    return { title: 'League Not Found' };
  }
  
  return {
    title: `${league.title} - DeepRacer Board`,
    description: `View the leaderboard for ${league.title}`,
    openGraph: {
      title: `${league.title} Leaderboard`,
      description: `Live rankings for ${league.title}`,
      images: league.logo ? [{ url: league.logo }] : undefined,
    },
  };
}

export default async function LeaderboardPage({ params }: Props) {
  const league = await getLeague(params.league);
  
  if (!league) {
    notFound();
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/manage">
              <Button variant="outline">Manage</Button>
            </Link>
            <Link href="/timer">
              <Button variant="outline">Timer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* League Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              {league.logo && (
                <Image
                  src={league.logo}
                  alt={league.title}
                  width={80}
                  height={80}
                  className="rounded-lg shadow-md"
                />
              )}
              <div>
                <CardTitle className="text-3xl">{league.title}</CardTitle>
                <p className="text-muted-foreground mt-2">
                  League Code: <span className="font-mono">{league.league}</span>
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Leaderboard */}
        <LeaderBoard league={params.league} />
      </main>
    </div>
  );
}