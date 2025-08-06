import { NextRequest } from 'next/server';
import { docClient, RACERS_TABLE, apiSuccess, apiError } from '@/lib/dynamodb';
import { PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { RacerInput, Racer } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RacerInput;
    
    if (!body.league || !body.email || !body.racerName) {
      return apiError('League, email, and racer name are required');
    }

    // 삭제 요청인 경우
    if (body.forceDelete) {
      const deleteCommand = new DeleteCommand({
        TableName: RACERS_TABLE,
        Key: {
          league: body.league,
          email: body.email,
        },
      });

      await docClient.send(deleteCommand);
      return apiSuccess({ message: 'Racer deleted successfully' });
    }

    const now = Date.now();
    
    // 새 레이서 생성 또는 기존 레이서 업데이트
    const racer: Racer = {
      league: body.league,
      email: body.email,
      racerName: body.racerName,
      laptime: body.laptime || 0,
      registered: now,
      modified: now,
    };

    // 기존 레이서가 있는 경우 최고 기록 보존 로직
    if (body.laptime) {
      // TODO: 기존 레이서 조회해서 더 빠른 시간만 업데이트
      // 지금은 단순하게 구현
    }

    const command = new PutCommand({
      TableName: RACERS_TABLE,
      Item: racer,
    });

    await docClient.send(command);

    return apiSuccess(racer, 201);
  } catch (error) {
    console.error('Failed to create/update/delete racer:', error);
    return apiError('Failed to process racer request');
  }
}