import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LeaderBoard } from '@/components/racer/leaderboard';
import { QRCode } from '@/components/effects/qrcode';
import { League } from '@/lib/types';

type Props = {
  params: Promise<{ league: string }>;
};

// cache()를 사용하여 동일한 leagueCode에 대한 중복 요청 방지
const getLeague = cache(async (leagueCode: string): Promise<League | null> => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/leagues/${leagueCode}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch league:', error);
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { league: leagueCode } = await params;
  const league = await getLeague(leagueCode);
  
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
  const { league: leagueCode } = await params;
  const league = await getLeague(leagueCode);

  if (!league) {
    notFound();
  }

  return (
    <>
      {/* League Header */}
      <header className="App-header">
        <div className="league-header">
          <div className="league-header-content">
            {league.logo && (
              <div className="league-logo-wrapper">
                <Image
                  src={league.logo}
                  alt={league.title}
                  width={150}
                  height={150}
                  className="league-logo"
                  unoptimized
                />
              </div>
            )}
            <div>
              <h1 className="league-page-title">{league.title}</h1>
              <p className="league-page-code">
                League Code: {league.league}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="App-body">
        <LeaderBoard league={leagueCode} />
      </div>

      {/* QR Code at bottom center */}
      <footer className="App-footer">
        <div className="qrcode-bottom">
          <QRCode league={leagueCode} />
        </div>
      </footer>
    </>
  );
}