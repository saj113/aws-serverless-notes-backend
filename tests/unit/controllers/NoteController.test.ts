import 'reflect-metadata';
import {INoteService} from '../../../src/services/NoteService/interfaces/INoteService';
import {NoteController} from '../../../src/controllers/NoteController/NoteController';
import {createNote} from '../testData/createNote';

describe('NoteController', () => {
    let noteServiceMock = {
        createNote: jest.fn(),
        deleteNote: jest.fn(),
        getNote: jest.fn(),
        getList: jest.fn(),
        updateNote: jest.fn(),
    };
    
    const getInstance = () => {
        const noteService: INoteService = noteServiceMock as INoteService;
        return new NoteController(noteService);
    }
    
    const   validHeaders = {
        'app_user_id': 'user_id',
        'app_user_name': 'user_name',
    };

    describe('createNote', () => {
        const validBody = JSON.stringify({Item: {
            cat: 'cat',
            title: 'title',
            content: 'content'
            }});
        test('should return 400 if body is not defined', async () => {
            const result = await getInstance().createNote({
                body: undefined,
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'Body is not defined'}));
        });

        test('should return 400 if body is invalid', async () => {
            const result = await getInstance().createNote({
                body: JSON.stringify({Item: {
                        unknownField: 'asd'
                    }}),
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'Body is invalid'}));
        });
        
        test('should return 400 if user ID is not defined', async () => {
            const result = await getInstance().createNote({
                body: validBody,
                headers: {
                    'app_user_name': 'user_name',
                },
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'User ID is not defined'}));
        });

        test('should return 400 if user name is not defined', async () => {
            const result = await getInstance().createNote({
                body: validBody,
                headers: {
                    'app_user_id': 'user_id',
                },
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'User name is not defined'}));
        });
        
        test('should return 200 if note is created', async () => {
            const note = createNote();
            noteServiceMock.createNote = jest.fn().mockImplementation(() => Promise.resolve(note));
            const result = await getInstance().createNote({
                body: validBody,
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify(note));
        });

        test('should pass valid params to note service', async () => {
            const note = createNote();
            noteServiceMock.createNote = jest.fn().mockImplementation(() => Promise.resolve(note));
            await getInstance().createNote({
                body: validBody,
                headers: {
                    'app_user_id': note.user_id,
                    'app_user_name': note.user_name,
                },
            } as any);

            expect(noteServiceMock.createNote).toHaveBeenCalledWith({
                title: 'title',
                cat: 'cat',
                content: 'content',
                user_id: note.user_id,
                user_name: note.user_name,
            });
        });

        test('should return 500 if note is not created', async () => {
            noteServiceMock.createNote.mockRejectedValueOnce(new Error('error'));
            const promise = getInstance().createNote({
                body: validBody,
                headers: {
                    'app_user_id': 'user_id',
                    'app_user_name': 'user_name',
                },
            } as any);
            await expect(promise).rejects.toThrow('error');
        });
    });
    
    describe('deleteNote', () => {
        test('should return 400 if user ID is not defined', async () => {
            const result = await getInstance().deleteNote({
                headers: {},
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'User ID is not defined'}));
        });

        test('should return 400 if timestamp is not defined', async () => {
            const result = await getInstance().deleteNote({
                headers: validHeaders,
                pathParameters: {},
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'Timestamp is not defined'}));
        });

        test('should return 200 if note is deleted', async () => {
            const result = await getInstance().deleteNote({
                headers: validHeaders,
                pathParameters: {
                    timestamp: '123',
                },
            } as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe('');
        });

        test('should pass valid params to note service', async () => {
            await getInstance().deleteNote({
                headers: validHeaders,
                pathParameters: {
                    timestamp: '123',
                },
            } as any);

            expect(noteServiceMock.deleteNote).toHaveBeenCalledWith({
                user_id: 'user_id',
                timestamp: '123',
            });
        });

        test('should return 500 if note is not deleted', async () => {
            noteServiceMock.deleteNote.mockRejectedValueOnce(new Error('error'));
            const promise = getInstance().deleteNote({
                headers: validHeaders,
                pathParameters: {
                    timestamp: '123',
                },
            } as any);
            await expect(promise).rejects.toThrow('error');
        });
    });
    
    describe('getNote', () => {
        test('should return 400 if note ID is not defined', async () => {
            const result = await getInstance().getNote({
                pathParameters: {},
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe('Note ID is not defined');
        });

        test('should return 200 if note is found', async () => {
            const note = createNote();
            noteServiceMock.getNote = jest.fn().mockImplementation(() => Promise.resolve(note));
            const result = await getInstance().getNote({
                pathParameters: {
                    note_id: note.note_id,
                },
            } as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify(note));
        });

        test('should pass valid params to note service', async () => {
            const note = createNote();
            noteServiceMock.getNote = jest.fn().mockImplementation(() => Promise.resolve(note));
            await getInstance().getNote({
                pathParameters: {
                    note_id: note.note_id,
                },
            } as any);

            expect(noteServiceMock.getNote).toHaveBeenCalledWith({
                note_id: note.note_id,
            });
        });

        test('should return 500 if note is not found', async () => {
            noteServiceMock.getNote.mockRejectedValueOnce(new Error('error'));
            const promise = getInstance().getNote({
                pathParameters: {
                    note_id: 'note_id',
                },
            } as any);
            await expect(promise).rejects.toThrow('error');
        });
    });
    
    describe('getList', () => {
        test('should return 400 if user ID is not defined', async () => {
            const result = await getInstance().getNotes({
                headers: {},
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'User ID is not defined'}));
        });

        test('should return 200 if notes are found', async () => {
            const note = createNote();
            noteServiceMock.getList = jest.fn().mockImplementation(() => Promise.resolve([note]));
            const result = await getInstance().getNotes({
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify([note]));
        });

        test('should pass valid params to note service', async () => {
            const note = createNote();
            noteServiceMock.getList = jest.fn().mockImplementation(() => Promise.resolve([note]));
            await getInstance().getNotes({
                headers: validHeaders,
            } as any);

            expect(noteServiceMock.getList).toHaveBeenCalledWith({
                user_id: 'user_id',
                limit: 5,
            });
        });

        test('should return 500 if notes are not found', async () => {
            noteServiceMock.getList.mockRejectedValueOnce(new Error('error'));
            const promise = getInstance().getNotes({
                headers: validHeaders,
            } as any);
            await expect(promise).rejects.toThrow('error');
        });
    });
    
    describe('updateNote', () => {
        const validBody = JSON.stringify({
            Item: {
                cat: 'cat',
                title: 'title',
                content: 'content',
                timestamp: 123,
                note_id: 'note_id',
            }
        });
        test('should return 400 if body is not defined', async () => {
            const result = await getInstance().updateNote({
                body: undefined,
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'Body is not defined'}));
        });

        test('should return 400 if body is invalid', async () => {
            const result = await getInstance().updateNote({
                body: JSON.stringify({
                    Item: {
                        unknownField: 'asd'
                    }
                }),
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(400);
            expect(result.body).toBe(JSON.stringify({error: 'Body is invalid'}));
        });

        test('should return 200 if note is updated', async () => {
            const note = createNote();
            noteServiceMock.updateNote = jest.fn().mockImplementation(() => Promise.resolve(note));
            const result = await getInstance().updateNote({
                body: validBody,
                headers: validHeaders,
            } as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify(note));
        });

        test('should pass valid params to note service', async () => {
            const note = createNote();
            noteServiceMock.updateNote = jest.fn().mockImplementation(() => Promise.resolve(note));
            await getInstance().updateNote({
                body: validBody,
                headers: {
                    'app_user_id': note.user_id,
                    'app_user_name': note.user_name,
                },
            } as any);

            expect(noteServiceMock.updateNote).toHaveBeenCalledWith({
                title: 'title',
                cat: 'cat',
                content: 'content',
                timestamp: 123,
                note_id: 'note_id',
                user_id: note.user_id,
                user_name: note.user_name,
            });
        });

        test('should return 500 if note is not updated', async () => {
            noteServiceMock.updateNote.mockRejectedValueOnce(new Error('error'));
            const promise = getInstance().updateNote({
                body: validBody,
                headers: {
                    'app_user_id': 'user_id',
                    'app_user_name': 'user_name',
                },
            } as any);
            await expect(promise).rejects.toThrow('error');
        });
    });
});
