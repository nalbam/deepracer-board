import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.AUTH_GOOGLE_ENABLED === "true" ? [Google] : []),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // 이메일을 ID로 사용하도록 설정
        session.user.id = session.user.email;
        session.user.provider = token.provider as string || 'unknown';
      }
      // JWT의 accessToken을 세션에 추가
      session.accessToken = token.accessToken as string;
      return session;
    },
    async signIn({ user }) {
      // 이메일이 있으면 로그인 허용 (별도 DB 저장 없이)
      return !!user.email;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        // 로그인 시 accessToken을 JWT에 저장
        token.accessToken = account.access_token;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // 로그인 페이지인 경우
      if (pathname === '/login') {
        // 이미 로그인한 사용자는 홈으로 리디렉션
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      // 인증이 필요한 경로 패턴
      const protectedPaths = [
        '/manage',
      ];

      // 인증이 필요한 경로인지 확인
      const isProtectedPath = protectedPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
      );

      // 인증이 필요한 경로일 경우에만 로그인 여부 확인
      if (isProtectedPath) {
        return isLoggedIn;
      }

      // 인증이 필요하지 않은 경로는 항상 허용
      return true;
    }
  },
  debug: process.env.AUTH_DEBUG === 'true',
});