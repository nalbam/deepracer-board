import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, USERS_TABLE, success, failure, Result } from '../dynamodb';

// 사용자 프로필 타입 정의
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  lastLogin: number;
  createdAt: number;
  updatedAt: number;
};

// upsertUser 함수의 입력 타입
export type UpsertUserInput = {
  email: string;
  name: string;
  image?: string;
  provider: string;
};

/**
 * 이메일로 사용자 조회
 */
export async function getUserByEmail(email: string): Promise<Result<UserProfile | null>> {
  try {
    email = email.toLowerCase();

    const command = new GetCommand({
      TableName: USERS_TABLE,
      Key: {
        id: email,
      },
    });

    const result = await docClient.send(command);
    
    if (!result.Item) {
      return success(null);
    }

    return success(result.Item as UserProfile);
  } catch (error) {
    console.error('Failed to get user by email:', error);
    return failure('Failed to get user');
  }
}

/**
 * 사용자 생성 또는 업데이트
 */
export async function upsertUser(input: UpsertUserInput): Promise<Result<UserProfile>> {
  try {
    const email = input.email.toLowerCase();
    const now = Date.now();

    // 기존 사용자 확인
    const existingUserResult = await getUserByEmail(email);
    if (!existingUserResult.success) {
      return failure('Failed to check existing user');
    }

    const existingUser = existingUserResult.data;

    let userProfile: UserProfile;

    if (existingUser) {
      // 기존 사용자 업데이트
      userProfile = {
        ...existingUser,
        name: input.name,
        image: input.image,
        provider: input.provider,
        lastLogin: now,
        updatedAt: now,
      };
    } else {
      // 새 사용자 생성
      userProfile = {
        id: email,
        email: email,
        name: input.name,
        image: input.image,
        provider: input.provider,
        lastLogin: now,
        createdAt: now,
        updatedAt: now,
      };
    }

    const putCommand = new PutCommand({
      TableName: USERS_TABLE,
      Item: userProfile,
    });

    await docClient.send(putCommand);

    return success(userProfile);
  } catch (error) {
    console.error('Failed to upsert user:', error);
    return failure('Failed to upsert user');
  }
}