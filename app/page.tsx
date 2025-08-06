import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LeagueList } from '@/components/league/league-list';

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">DeepRacer Board</h1>
          </div>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Active Leagues</h2>
          <p className="text-muted-foreground">
            Join a league and compete with other racers
          </p>
        </div>

        {/* League List */}
        <LeagueList showAll />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 DeepRacer Board. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://github.com/nalbam/deepracer-board"
              className="text-sm text-muted-foreground hover:underline"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}