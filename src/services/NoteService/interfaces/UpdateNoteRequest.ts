export interface UpdateNoteRequest {
    user_id: string;
    user_name: string;
    note_id: string;
    timestamp: number;
    title: string;
    content: string;
    cat: string;
}
