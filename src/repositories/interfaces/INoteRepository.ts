import {Note} from '../../models/Note';

export interface INoteRepository {
    create(note: Note): Promise<void>;
    update(note: Note): Promise<boolean>;
    delete(userId: string, timestamp: string): Promise<void>;
    getByUserId(userId: string, limit: number): Promise<Note[]>;
    getByNoteId(noteId: string): Promise<Note | null>;
}
