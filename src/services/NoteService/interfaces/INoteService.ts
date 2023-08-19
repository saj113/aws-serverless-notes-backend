import {CreateNoteRequest} from './CreateNoteRequest';
import {Note} from '../../../models/Note';
import {UpdateNoteRequest} from './UpdateNoteRequest';
import {DeleteNoteRequest} from './DeleteNoteRequest';
import {GetListRequest} from './GetListRequest';
import {GetNoteRequest} from './GetNoteRequest';

export interface INoteService {
    createNote(request: CreateNoteRequest): Promise<Note>;
    updateNote(request: UpdateNoteRequest): Promise<Note>;
    deleteNote(request: DeleteNoteRequest): Promise<void>;
    getList(request: GetListRequest): Promise<Note[]>;
    getNote(request: GetNoteRequest): Promise<Note | null>;
}
