export type UpdateNoteBody = {
    Item: {
        note_id: string;
        timestamp: number;
        title: string;
        content: string;
        cat: string;
    }
};
