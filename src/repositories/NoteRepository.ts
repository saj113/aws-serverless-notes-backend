import {
    DeleteItemCommand,
    DynamoDBClient,
    PutItemCommand,
    QueryCommand
} from '@aws-sdk/client-dynamodb';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import { INoteRepository } from './interfaces/INoteRepository';
import { Note } from '../models/Note';

const tableName = process.env.NOTES_TABLE!;

export class NoteRepository implements INoteRepository {
    private readonly _dynamoClient: DynamoDBClient;

    constructor() {
        this._dynamoClient = new DynamoDBClient({});
    }

    async create(note: Note): Promise<void> {
        const command = new PutItemCommand({
            TableName: tableName,
            Item: marshall(note),
        });
        await this._dynamoClient.send(command);
    }

    async update(note: Note): Promise<boolean> {
        const command = new PutItemCommand({
            TableName: tableName,
            Item: marshall(note),
            ConditionExpression: '#t = :t',
            ExpressionAttributeNames: {
                '#t': 'timestamp'
            },
            ExpressionAttributeValues: {
                ':t': { N: note.timestamp.toString() }
            }
        });

        const commandOutput = await this._dynamoClient.send(command);

        return commandOutput.$metadata.httpStatusCode === 200;
    }

    async delete(userId: string, timestamp: string): Promise<void> {
        const command = new DeleteItemCommand({
            TableName: tableName,
            Key: {
                user_id: { S: userId },
                timestamp: { N: timestamp },
            },
        });
        await this._dynamoClient.send(command);
    }

    async getByUserId(userId: string, limit: number): Promise<Note[]> {
        const command = new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: 'user_id = :uid',
            ExpressionAttributeValues: {
                ":uid": { S: userId },
            },
            Limit: limit,
            ScanIndexForward: false,
        });
        const result = await this._dynamoClient.send(command);
        return result.Items ? result.Items.map(item => unmarshall(item) as Note) : [];
    }

    async getByNoteId(noteId: string): Promise<Note | null> {
        const command = new QueryCommand({
            TableName: tableName,
            IndexName: tableName + '-gsi-1',
            KeyConditionExpression: 'note_id = :note_id',
            ExpressionAttributeValues: {
                ":note_id": { S: noteId },
            },
            Limit: 1
        });
        const result = await this._dynamoClient.send(command);
        if (result.Items && result.Items.length > 0) {
            return unmarshall(result.Items[0]) as Note;
        }

        return null;
    }
}
