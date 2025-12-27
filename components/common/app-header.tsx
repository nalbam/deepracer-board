import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { LogoutButton } from '@/components/manage/logout-button';

export async function AppHeader() {
  const session = await auth();

  return (
    <header className="app-header">
      <div className="app-header-container">
        {/* Logo and Title */}
        <div className="app-header-brand">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={120}
              height={32}
              className="app-header-logo"
            />
            <h1 className="app-header-title">
              DeepRacer Board
            </h1>
          </Link>
        </div>

        {/* Navigation and User Actions */}
        <div className="app-header-actions">
          <Link href="/" className="btn-link btn-secondary">
            Home
          </Link>
          {session?.user ? (
            <>
              <Link href="/manage" className="btn-link btn-secondary">
                Manage
              </Link>
              <Link href="/timer" className="btn-link btn-secondary">
                Timer
              </Link>
              <div className="app-user-info">
                <div className="app-user-name">{session.user.name || session.user.email}</div>
                <div className="app-user-email">{session.user.email}</div>
              </div>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/timer" className="btn-link btn-secondary">
                Timer
              </Link>
              <Link href="/login" className="btn-link btn-primary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
