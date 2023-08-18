import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId, getUserName } from '../utils/headers.utils';
import { handleError } from '../utils/error.utils';
import {diContainer} from '../container/diContainer';
import {INoteService} from '../services/NoteService/interfaces/INoteService';
import {apiGatewayResult} from '../utils/apiGatewayProxyResult.utils';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return apiGatewayResult(400, JSON.stringify({error: 'Body is not defined'}));
    }

    const service = diContainer.resolve<INoteService>('NoteService');
    try {
        const note = await service.createNote({
            ...JSON.parse(event.body).Item,
            user_id: getUserId(event.headers),
            user_name: getUserName(event.headers),
        });

        return apiGatewayResult(200, JSON.stringify(note));
    } catch (error: any) {
        return handleError(error);
    }
};
