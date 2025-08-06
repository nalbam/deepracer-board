import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { docClient, LEAGUES_TABLE, apiSuccess, apiError } from '@/lib/dynamodb';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { League } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { league: string } }
) {
  try {
    const command = new GetCommand({
      TableName: LEAGUES_TABLE,
      Key: {
        league: params.league,
      },
    });

    const result = await docClient.send(command);
    
    if (!result.Item) {
      return apiError('League not found', 404);
    }

    const league = result.Item as League;
    return apiSuccess(league);
  } catch (error) {
    console.error('Failed to fetch league:', error);
    return apiError('Failed to fetch league');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { league: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401);
    }

    // 리그 소유자 확인
    const getCommand = new GetCommand({
      TableName: LEAGUES_TABLE,
      Key: {
        league: params.league,
      },
    });

    const getResult = await docClient.send(getCommand);
    
    if (!getResult.Item) {
      return apiError('League not found', 404);
    }

    const league = getResult.Item as League;
    
    if (league.userId !== session.user.id) {
      return apiError('Forbidden: You can only delete your own leagues', 403);
    }

    // 리그 삭제
    const deleteCommand = new DeleteCommand({
      TableName: LEAGUES_TABLE,
      Key: {
        league: params.league,
      },
    });

    await docClient.send(deleteCommand);

    return apiSuccess({ message: 'League deleted successfully' });
  } catch (error) {
    console.error('Failed to delete league:', error);
    return apiError('Failed to delete league');
  }
}