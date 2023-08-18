import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../utils/headers.utils';
import {apiGatewayResult} from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';
import {diContainer} from '../container/diContainer';
import {INoteService} from '../services/NoteService/interfaces/INoteService';
import {getParam} from '../utils/pathParameters.utils';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = getUserId(event.headers);
        if (!userId) {
            return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
        }
        
        const timestamp = getParam(event.pathParameters, 'timestamp');
        if (!timestamp) {
            return apiGatewayResult(400, JSON.stringify({error: 'Timestamp is not defined'}));
        }

        const service = diContainer.resolve<INoteService>('NoteService');
        await service.deleteNote({
            user_id: userId,
            timestamp,
        });

        return apiGatewayResult();
    } catch (error: any) {
        return handleError(error);
    }
};
