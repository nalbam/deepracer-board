'use server';

import { signOut } from '@/lib/auth';

export async function handleLogout() {
  await signOut({ redirectTo: '/' });
}
