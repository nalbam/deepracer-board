import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { docClient, RACERS_TABLE, LEAGUES_TABLE, apiSuccess, apiError } from '@/lib/dynamodb';
import { QueryCommand, DeleteCommand, GetCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Racer, LeaderboardEntry, League } from '@/lib/types';

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401);
    }

    const { league } = await params;

    // 리그 소유자 확인
    const getLeagueCommand = new GetCommand({
      TableName: LEAGUES_TABLE,
      Key: {
        league,
      },
    });

    const leagueResult = await docClient.send(getLeagueCommand);

    if (!leagueResult.Item) {
      return apiError('League not found', 404);
    }

    const leagueData = leagueResult.Item as League;

    if (leagueData.userId !== session.user.id) {
      return apiError('Forbidden: You can only delete racers from your own leagues', 403);
    }

    // 리그의 모든 레이서 조회
    const queryCommand = new QueryCommand({
      TableName: RACERS_TABLE,
      KeyConditionExpression: 'league = :league',
      ExpressionAttributeValues: {
        ':league': league,
      },
    });

    const queryResult = await docClient.send(queryCommand);
    const racers = queryResult.Items || [];

    if (racers.length === 0) {
      return apiSuccess({ message: 'No racers to delete', deletedCount: 0 });
    }

    // BatchWrite로 모든 레이서 삭제 (최대 25개씩)
    const chunks = [];
    for (let i = 0; i < racers.length; i += 25) {
      chunks.push(racers.slice(i, i + 25));
    }

    for (const chunk of chunks) {
      const batchWriteCommand = new BatchWriteCommand({
        RequestItems: {
          [RACERS_TABLE]: chunk.map((racer) => ({
            DeleteRequest: {
              Key: {
                league: racer.league,
                email: racer.email,
              },
            },
          })),
        },
      });

      await docClient.send(batchWriteCommand);
    }

    return apiSuccess({
      message: 'All racers deleted successfully',
      deletedCount: racers.length
    });
  } catch (error) {
    console.error('Failed to delete racers:', error);
    return apiError('Failed to delete racers');
  }
}