import { NextRequest } from 'next/server';
import { docClient, RACERS_TABLE, apiSuccess, apiError } from '@/lib/dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Racer, LeaderboardEntry } from '@/lib/types';

// 문자열 laptime을 밀리초로 변환 (예: "00:12.864" -> 12864)
function parseLaptime(laptime: string | number): number {
  if (typeof laptime === 'number') return laptime;
  if (!laptime || laptime === '0' || laptime === '') return 0;

  try {
    const parts = laptime.split(':');
    if (parts.length !== 2) return 0;

    const minutes = parseInt(parts[0], 10);
    const secondsParts = parts[1].split('.');
    const seconds = parseInt(secondsParts[0], 10);
    const milliseconds = secondsParts[1] ? parseInt(secondsParts[1].padEnd(3, '0'), 10) : 0;

    return minutes * 60000 + seconds * 1000 + milliseconds;
  } catch {
    return 0;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  try {
    const { league } = await params;

    const command = new QueryCommand({
      TableName: RACERS_TABLE,
      KeyConditionExpression: 'league = :league',
      ExpressionAttributeValues: {
        ':league': league,
      },
    });

    const result = await docClient.send(command);
    const rawRacers = result.Items || [];

    // laptime을 숫자로 변환
    const racers = rawRacers.map((racer: any) => ({
      ...racer,
      laptime: parseLaptime(racer.laptime),
    })) as Racer[];

    // 랩타임 기준 정렬 및 순위 계산
    const sortedRacers = racers
      .filter((racer) => racer.laptime > 0) // 랩타임이 있는 레이서만
      .sort((a, b) => {
        if (a.laptime === b.laptime) {
          return a.registered - b.registered; // 동일 시간시 먼저 등록한 순
        }
        return a.laptime - b.laptime; // 빠른 시간 순
      });

    // 랩타임이 없는 레이서들 추가
    const noTimeRacers = racers.filter((racer) => racer.laptime === 0);

    // 순위 정보 추가
    const leaderboard: LeaderboardEntry[] = [
      ...sortedRacers.map((racer, index) => ({
        ...racer,
        rank: index + 1,
      })),
      ...noTimeRacers.map((racer) => ({
        ...racer,
        rank: 0, // 순위 없음
      })),
    ];

    return apiSuccess(leaderboard);
  } catch (error) {
    console.error('Failed to fetch racers:', error);
    return apiError('Failed to fetch racers');
  }
}