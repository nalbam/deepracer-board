import { NextRequest } from 'next/server';
import { docClient, RACERS_TABLE, apiSuccess, apiError } from '@/lib/dynamodb';
import { PutCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { RacerInput, Racer } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RacerInput;

    if (!body.league || !body.email) {
      return apiError('League and email are required');
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

    // 삭제가 아니면 racerName 필수
    if (!body.racerName) {
      return apiError('Racer name is required');
    }

    const now = Date.now();

    // 기존 레이서 조회
    const getCommand = new GetCommand({
      TableName: RACERS_TABLE,
      Key: {
        league: body.league,
        email: body.email,
      },
    });

    const existingResult = await docClient.send(getCommand);
    const existingRacer = existingResult.Item as Racer | undefined;

    // 새 레이서 데이터 준비
    let finalLaptime = body.laptime || 0;
    let registered = now;

    if (existingRacer) {
      // 기존 레이서가 있는 경우
      registered = existingRacer.registered; // 최초 등록 시간 유지

      // 랩타임 업데이트 로직
      if (body.laptime) {
        // forceUpdate가 true이면 무조건 업데이트
        if (body.forceUpdate) {
          finalLaptime = body.laptime;
        } else {
          // 최고 기록 보존: 기존 기록이 없거나, 새 기록이 더 빠른 경우만 업데이트
          if (!existingRacer.laptime || body.laptime < existingRacer.laptime) {
            finalLaptime = body.laptime;
          } else {
            // 기존 기록이 더 빠르면 기존 기록 유지
            finalLaptime = existingRacer.laptime;
          }
        }
      } else {
        // 랩타임이 제공되지 않은 경우 기존 기록 유지
        finalLaptime = existingRacer.laptime || 0;
      }
    }

    const racer: Racer = {
      league: body.league,
      email: body.email,
      racerName: body.racerName,
      laptime: finalLaptime,
      registered,
      modified: now,
    };

    const command = new PutCommand({
      TableName: RACERS_TABLE,
      Item: racer,
    });

    await docClient.send(command);

    return apiSuccess(racer, existingRacer ? 200 : 201);
  } catch (error) {
    console.error('Failed to create/update/delete racer:', error);
    return apiError('Failed to process racer request');
  }
}