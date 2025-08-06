import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to DeepRacer Board</CardTitle>
          <CardDescription>
            Sign in to manage your leagues and racers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async () => {
              'use server';
              await signIn('cognito', { redirectTo: '/manage' });
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              Sign in with AWS Cognito
            </Button>
          </form>
          
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