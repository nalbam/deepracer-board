import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Session 타입 확장 - user 객체에 id와 provider 필드 추가
   */
  interface Session {
    user: {
      id?: string;
      provider?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  /**
   * JWT 타입 확장 - provider와 accessToken 필드 추가
   */
  interface JWT {
    provider?: string;
    accessToken?: string;
  }
}