'use client';

import { LogOut } from 'lucide-react';
import { handleLogout } from '@/lib/actions/auth';

export function LogoutButton() {
  return (
    <button
      onClick={() => handleLogout()}
      className="btn-link btn-logout"
      aria-label="Logout"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
