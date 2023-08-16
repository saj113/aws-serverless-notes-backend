import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { validatePassParameter } from '../validators/apiGatewayProxyEventValidators';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { create200Response, create404Response } from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const note_id = decodeURIComponent(validatePassParameter(event, 'note_id'));
        const params: DocumentClient.QueryInput = {
            TableName: tableName!,
            IndexName: tableName + '-gsi-1',
            KeyConditionExpression: 'note_id = :note_id',
            ExpressionAttributeValues: {
                ":note_id": note_id,
            },
            Limit: 1,
        };
        const response = await dynamodb.query(params).promise();
        if (!response || !response.Items || response.Items.length === 0) {
            return create404Response('Note not found');
        }

        return create200Response(JSON.stringify(response.Items[0]));
    } catch (error: any) {
        return handleError(error);
    }
};
