import {inject, injectable} from 'tsyringe';
import {INoteController} from './interfaces/INoteController';
import {INoteService} from '../../services/NoteService/interfaces/INoteService';
import {apiGatewayResult} from '../../utils/apiGatewayProxyResult.utils';
import {getUserId, getUserName} from '../../utils/headers.utils';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {getParam} from '../../utils/pathParameters.utils';
import {is} from 'typia';
import {CreateNoteBody} from './interfaces/CreateNoteBody';
import {UpdateNoteBody} from './interfaces/UpdateNoteBody';

@injectable()
export class NoteController implements INoteController {
    constructor(
        @inject('NoteService') private readonly _noteService: INoteService,
    ) {
    }

    async createNote(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        if (!event.body) {
            return apiGatewayResult(400, JSON.stringify({error: 'Body is not defined'}));
        }

        const body = JSON.parse(event.body);
        if (!is<CreateNoteBody>(body)) {
            return apiGatewayResult(400, JSON.stringify({error: 'Body is invalid'}));
        }

        const userId = getUserId(event.headers);
        if (!userId) {
            return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
        }
        
        const userName = getUserName(event.headers);
        if (!userName) {
            return apiGatewayResult(400, JSON.stringify({error: 'User name is not defined'}));
        }
        
        const note = await this._noteService.createNote({
            ...body.Item,
            user_id: userId,
            user_name: userName,
        });

        return apiGatewayResult(200, JSON.stringify(note));
    }

    async deleteNote(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const userId = getUserId(event.headers);
        if (!userId) {
            return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
        }

        const timestamp = getParam(event.pathParameters, 'timestamp');
        if (!timestamp) {
            return apiGatewayResult(400, JSON.stringify({error: 'Timestamp is not defined'}));
        }

        await this._noteService.deleteNote({
            user_id: userId,
            timestamp,
        });

        return apiGatewayResult();
    }

    async getNote(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const noteId = getParam(event.pathParameters, 'note_id');
        if (!noteId) {
            return apiGatewayResult(400, 'Note ID is not defined');
        }

        const note = await this._noteService.getNote({
            note_id: decodeURIComponent(noteId),
        });

        return apiGatewayResult(200, JSON.stringify(note));
    }

    async getNotes(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const query = event.queryStringParameters;
        const limit = query && query.limit ? parseInt(query.limit) : 5;
        const userId = getUserId(event.headers);
        if (!userId) {
            return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
        }

        const notes = await this._noteService.getList({
            user_id: userId,
            limit
        });

        return apiGatewayResult(200, JSON.stringify(notes));
    }

    async updateNote(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        if (!event.body) {
            return apiGatewayResult(400, JSON.stringify({error: 'Body is not defined'}));
        }

        const body = JSON.parse(event.body);
        if (!is<UpdateNoteBody>(body)) {
            return apiGatewayResult(400, JSON.stringify({error: 'Body is invalid'}));
        }

        const userId = getUserId(event.headers);
        const userName = getUserName(event.headers);
        if (!userId) {
            return apiGatewayResult(400, JSON.stringify({error: 'User ID is not defined'}));
        }

        if (!userName) {
            return apiGatewayResult(400, JSON.stringify({error: 'User name is not defined'}));
        }

        const note = await this._noteService.updateNote({
            ...body.Item,
            user_id: userId,
            user_name: userName,
        });

        return apiGatewayResult(200, JSON.stringify(note));
    }
}
