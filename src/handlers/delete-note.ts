import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { getUserId } from '../utils/headers.utils';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { validatePassParameter } from '../validators/apiGatewayProxyEventValidators';
import { create200Response } from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const timestamp = parseInt(validatePassParameter(event, 'timestamp'));

        const params: DocumentClient.DeleteItemInput = {
            TableName: tableName!,
            Key: {
                user_id: getUserId(event.headers),
                timestamp: timestamp,
            },
        };

        await dynamodb.delete(params).promise();

        return create200Response();
    } catch (error: any) {
        return handleError(error);
    }
};
