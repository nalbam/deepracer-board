import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { LogoutButton } from './logout-button';

export async function ManageHeader() {
  const session = await auth();

  return (
    <header className="manage-header">
      <div className="manage-header-container">
        {/* Logo and Title */}
        <div className="manage-header-brand">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={120}
              height={32}
              className="manage-header-logo"
            />
            <h1 className="manage-header-title">
              DeepRacer Board
            </h1>
          </Link>
        </div>

        {/* User Info and Actions */}
        <div className="manage-header-actions">
          {session?.user && (
            <div className="manage-user-info">
              <div className="manage-user-name">{session.user.name || session.user.email}</div>
              <div className="manage-user-email">{session.user.email}</div>
            </div>
          )}
          <Link href="/" className="btn-link">
            Home
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
