import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

const authConfig: NextAuthConfig = {
  providers: [
    {
      id: 'cognito',
      name: 'Cognito',
      type: 'oidc',
      clientId: process.env.AUTH_COGNITO_CLIENT_ID!,
      clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET!,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      checks: ['pkce', 'state'],
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? session.user.email;
        session.user.provider = 'cognito';
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.sub = account.providerAccountId;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      // 사용자 정보를 DynamoDB에 저장할 수 있음
      // TODO: implement user upsert to DynamoDB
      
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);