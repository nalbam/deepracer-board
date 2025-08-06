import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/manage');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');

  // 로그인 페이지에 로그인한 사용자가 접근하면 홈으로 리다이렉트
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 보호된 라우트에 로그인하지 않은 사용자가 접근하면 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // 보호된 라우트
    '/manage/:path*',
    // 인증 라우트
    '/login',
    // API 라우트 제외
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};