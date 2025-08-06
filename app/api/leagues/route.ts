import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { docClient, LEAGUES_TABLE, apiSuccess, apiError } from '@/lib/dynamodb';
import { ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { League, LeagueInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    let params;
    
    if (showAll) {
      // 모든 리그 목록 조회
      params = {
        TableName: LEAGUES_TABLE,
        ProjectionExpression: 'league, title, logo, dateOpen, dateClose',
      };
    } else {
      // 사용자의 리그 목록 조회 (인증 필요)
      const session = await auth();
      if (!session?.user?.id) {
        return apiError('Unauthorized', 401);
      }

      params = {
        TableName: LEAGUES_TABLE,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': session.user.id,
        },
      };
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);
    
    const leagues = result.Items as League[] || [];
    
    // 수정 시간 기준 내림차순 정렬
    leagues.sort((a, b) => (b.modified || 0) - (a.modified || 0));

    return apiSuccess(leagues);
  } catch (error) {
    console.error('Failed to fetch leagues:', error);
    return apiError('Failed to fetch leagues');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401);
    }

    const body = await request.json() as LeagueInput;
    
    if (!body.league || !body.title) {
      return apiError('League code and title are required');
    }

    const now = Date.now();
    const league: League = {
      league: body.league,
      title: body.title,
      logo: body.logo,
      dateOpen: body.dateOpen,
      dateClose: body.dateClose,
      dateTZ: body.dateTZ || 'Asia/Seoul',
      userId: session.user.id,
      registered: now,
      modified: now,
    };

    const command = new PutCommand({
      TableName: LEAGUES_TABLE,
      Item: league,
    });

    await docClient.send(command);

    return apiSuccess(league, 201);
  } catch (error) {
    console.error('Failed to create/update league:', error);
    return apiError('Failed to create/update league');
  }
}