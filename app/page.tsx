import { AppHeader } from '@/components/common/app-header';
import { LeagueList } from '@/components/league/league-list';

export default async function HomePage() {
  return (
    <>
      <AppHeader />

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