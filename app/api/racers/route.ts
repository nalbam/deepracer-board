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

    // 기존 랩타임을 숫자로 변환 (레거시 데이터 호환)
    const parseExistingLaptime = (laptime: any): number => {
      if (!laptime) return 0;
      if (typeof laptime === 'number') return laptime;
      if (typeof laptime === 'string') {
        // MM:SS.mmm 형식 문자열을 밀리초로 변환
        const match = laptime.match(/^(\d{2}):(\d{2})\.(\d{3})$/);
        if (match) {
          const [, minutes, seconds, milliseconds] = match;
          return parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(milliseconds);
        }
      }
      return 0;
    };

    // 새 레이서 데이터 준비
    let finalLaptime = body.laptime || 0;
    let registered = now;

    if (existingRacer) {
      // 기존 레이서가 있는 경우
      registered = existingRacer.registered; // 최초 등록 시간 유지

      // 기존 랩타임을 숫자로 변환
      const existingLaptimeMs = parseExistingLaptime(existingRacer.laptime);

      // 랩타임 업데이트 로직
      if (body.laptime) {
        // forceUpdate가 true이면 무조건 업데이트
        if (body.forceUpdate) {
          finalLaptime = body.laptime;
        } else {
          // 최고 기록 보존: 기존 기록이 없거나, 새 기록이 더 빠른 경우만 업데이트
          if (!existingLaptimeMs || body.laptime < existingLaptimeMs) {
            finalLaptime = body.laptime;
          } else {
            finalLaptime = existingLaptimeMs;
          }
        }
      } else {
        // 랩타임이 제공되지 않은 경우 기존 기록 유지
        finalLaptime = existingLaptimeMs;
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