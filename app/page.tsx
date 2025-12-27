import Link from 'next/link';
import Image from 'next/image';
import { LeagueList } from '@/components/league/league-list';

export default async function HomePage() {
  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div className="page-header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={120}
              height={32}
              className="page-header-logo"
            />
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#eee' }}>
              DeepRacer Board
            </h1>
          </div>
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

      {/* Main Content */}
      <div className="App-body">
        <LeagueList showAll />
      </div>

      {/* Footer */}
      <footer className="App-footer">
        <p style={{ color: '#aaa', fontSize: '14px' }}>
          © 2024 DeepRacer Board. All rights reserved.
        </p>
      </footer>
    </>
  );
}