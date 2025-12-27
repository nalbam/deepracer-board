import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { LeaderBoard } from '@/components/racer/leaderboard';
import { QRCode } from '@/components/effects/qrcode';
import { League } from '@/lib/types';

type Props = {
  params: Promise<{ league: string }>;
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
      {/* Page Header */}
      <header className="page-header">
        <div className="page-header-container">
          <Link href="/">
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={120}
              height={32}
              className="page-header-logo"
            />
          </Link>
          <div className="page-header-actions">
            <Link href="/manage" className="btn-link">
              Manage
            </Link>
            <Link href="/timer" className="btn-link">
              Timer
            </Link>
          </div>
        </div>
      </header>

      {/* League Header */}
      <header className="App-header">
        <div className="league-header">
          <div className="league-header-content">
            {league.logo && (
              <Image
                src={league.logo}
                alt={league.title}
                width={80}
                height={80}
                className="league-logo"
                unoptimized
              />
            )}
            <div>
              <h1 className="league-title">{league.title}</h1>
              <p className="league-code">
                League Code: {league.league}
              </p>
            </div>
          </div>
          <QRCode league={leagueCode} />
        </div>
      </header>

      {/* Main Content */}
      <div className="App-body">
        <LeaderBoard league={leagueCode} />
      </div>
    </>
  );
}