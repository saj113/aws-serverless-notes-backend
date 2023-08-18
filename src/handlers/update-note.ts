import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId, getUserName } from '../utils/headers.utils';
import {apiGatewayResult} from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';
import {diContainer} from '../container/diContainer';
import {INoteService} from '../services/NoteService/interfaces/INoteService';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event.headers);
    const userName = getUserName(event.headers);
    if (!userId) {
        return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
    }

    if (!userName) {
        return apiGatewayResult(400, JSON.stringify({error: 'User name is not defined'}));
    }
    
    try {
        const service = diContainer.resolve<INoteService>('NoteService');
        const note = await service.updateNote({
            ...JSON.parse(event.body!).Item,
            user_id: userId,
            user_name: userName,
        });

        return apiGatewayResult(200, JSON.stringify(note));
    } catch (error: any) {
        return handleError(error);
    }
};
