import {inject, injectable} from 'tsyringe';
import {INoteService} from './interfaces/INoteService';
import {INoteRepository} from '../../repositories/interfaces/INoteRepository';
import {CreateNoteRequest} from './interfaces/CreateNoteRequest';
import {Note} from '../../models/Note';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment/moment';
import {UpdateNoteRequest} from './interfaces/UpdateNoteRequest';
import {DeleteNoteRequest} from './interfaces/DeleteNoteRequest';
import {GetListRequest} from './interfaces/GetListRequest';
import {GetNoteRequest} from './interfaces/GetNoteRequest';

@injectable()
export class NoteService implements INoteService {
    constructor(
        @inject('NoteRepository') private readonly _noteRepository: INoteRepository,
    ) {
    }
    
    async createNote(request: CreateNoteRequest): Promise<Note> {
        const note: Note = {
            ...request,
            note_id: request.user_id + ':' + uuidv4(),
            timestamp: moment().unix(),
            expires: this.getNewExpires(),
        };

        await this._noteRepository.create(note);
        return note;
    }
    
    async updateNote(request: UpdateNoteRequest): Promise<Note> {
        const note: Note = {
            ...request,
            expires: this.getNewExpires(),
        };
        const result = await this._noteRepository.update(note);
        if (!result) {
            throw new Error('Note not found');
        }
        
        return note;
    }

    async deleteNote(request: DeleteNoteRequest): Promise<void> {
        await this._noteRepository.delete(request.user_id, request.timestamp);
    }

    async getList(request: GetListRequest): Promise<Note[]> {
        return await this._noteRepository.getByUserId(request.user_id, request.limit);
    }

    async getNote(request: GetNoteRequest): Promise<Note | null> {
        return await this._noteRepository.getByNoteId(request.note_id);
    }

    private getNewExpires(): number {
        return moment().add(90, 'days').unix();
    }
}
