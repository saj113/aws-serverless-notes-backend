import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {INoteController} from '../controllers/NoteController/interfaces/INoteController';
import {handleApiGatewayEvent} from '../utils/lambdaHandler.utils';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return await handleApiGatewayEvent<INoteController>('NoteController', async (controller) => { 
        return await controller.createNote(event);
    });
};
