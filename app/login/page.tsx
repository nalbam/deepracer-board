import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  // Google Auth가 활성화되어 있는지 확인
  const isGoogleEnabled = process.env.AUTH_GOOGLE_ENABLED === 'true';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo-community-races.png"
              alt="DeepRacer"
              width={200}
              height={50}
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Welcome to DeepRacer Board</CardTitle>
          <CardDescription>
            Sign in to manage your leagues and racers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGoogleEnabled && (
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: '/manage' });
              }}
            >
              <Button type="submit" className="w-full" size="lg" variant="outline">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </form>
          )}
          
          {!isGoogleEnabled && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Authentication is currently disabled.
              </p>
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Public leaderboards are available without login.{' '}
              <Link href="/" className="text-primary hover:underline">
                Browse Leagues
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}