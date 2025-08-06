import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// 환경 변수에서 AWS 설정 값 가져오기
const region = process.env.AUTH_AWS_REGION || 'ap-northeast-2';

// DynamoDB 클라이언트 생성
const client = new DynamoDBClient({
  region,
  credentials: process.env.AUTH_AWS_ACCESS_KEY_ID && process.env.AUTH_AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AUTH_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AUTH_AWS_SECRET_ACCESS_KEY,
      }
    : undefined, // 로컬 개발 환경에서는 환경 변수 또는 ~/.aws/credentials 파일 사용
});

// DynamoDB Document 클라이언트 생성 (JSON과 유사한 방식으로 상호작용)
export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

// DynamoDB 테이블 이름
export const LEAGUES_TABLE = process.env.NEXT_DYNAMODB_LEAGUES_TABLE || 'deepracer-board-leagues';
export const RACERS_TABLE = process.env.NEXT_DYNAMODB_RACERS_TABLE || 'deepracer-board-racers';

// 공통 결과 타입 정의
export type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 성공 응답 생성 유틸리티 함수
export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

// 실패 응답 생성 유틸리티 함수
export function failure<T>(error: string): Result<T> {
  return { success: false, error };
}

// API 성공 응답 형식
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

// API 실패 응답 형식
export function apiError(error: string, status = 400) {
  return Response.json({ success: false, error }, { status });
}