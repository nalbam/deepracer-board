import { auth } from "@/lib/auth";

// auth 설정에서 authorized 콜백을 사용하므로 미들웨어는 단순하게 처리
export default auth;

export const config = {
  matcher: [
    // 보호된 라우트와 로그인 페이지
    '/manage/:path*',
    '/login',
    // API 라우트와 정적 파일 제외
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|images|sounds).*)',
  ],
};