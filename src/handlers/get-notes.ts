import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { getUserId } from '../utils/headers.utils';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { create200Response } from '../utils/apiGatewayProxyResult.utils';
import { handleError } from '../utils/error.utils';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE!;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const query = event.queryStringParameters;
        const limit = query && query.limit ? parseInt(query.limit) : 5;
        const user_id = getUserId(event.headers);
        const params: DocumentClient.QueryInput = {
            TableName: tableName,
            KeyConditionExpression: 'user_id = :uid',
            ExpressionAttributeValues: {
                ":uid": user_id,
            },
            Limit: limit,
            ScanIndexForward: false,
        };
        
        let startTimestamp = query && query.start ? parseInt(query.start) : 0;
        if (startTimestamp > 0) {
            params.ExclusiveStartKey = {
                user_id,
                timestamp: startTimestamp
            };
        }

        const data = await dynamodb.query(params).promise();
        return create200Response(JSON.stringify(data));
    } catch (error: any) {
        return handleError(error);
    }
};
