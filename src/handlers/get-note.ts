import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {apiGatewayResult} from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';
import {getParam} from '../utils/pathParameters.utils';
import {diContainer} from '../container/diContainer';
import {INoteService} from '../services/NoteService/interfaces/INoteService';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const noteId = getParam(event.pathParameters, 'note_id');
    if (!noteId) {
        return apiGatewayResult(400, 'Note ID is not defined');
    }

    try {
        const service = diContainer.resolve<INoteService>('NoteService');
        const note = await service.getNote({
            note_id: decodeURIComponent(noteId),
        });

        return apiGatewayResult(200, JSON.stringify(note));
    } catch (error: any) {
        return handleError(error);
    }
};
