import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../utils/headers.utils';
import {apiGatewayResult} from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';
import {diContainer} from '../container/diContainer';
import {INoteService} from '../services/NoteService/interfaces/INoteService';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('get-notes');
    try {
        const query = event.queryStringParameters;
        const limit = query && query.limit ? parseInt(query.limit) : 5;
        const userId = getUserId(event.headers);
        if (!userId) {
            return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
        }
        const service = diContainer.resolve<INoteService>('NoteService');
        const notes = await service.getList({
            user_id: userId,
            limit
        });

        return apiGatewayResult(200, JSON.stringify(notes));
    } catch (error: any) {
        return handleError(error);
    }
};
