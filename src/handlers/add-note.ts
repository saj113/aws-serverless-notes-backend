import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { getResponseHeaders, getUserId, getUserName } from '../utils/headers.utils';
import { validateBody } from '../validators/apiGatewayProxyEventValidators';
import { handleError } from '../utils/error.utils';
import { Note } from '../models/Note';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const item = getItem(event);
        await dynamodb.put({
            TableName: tableName!,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(item)
        };
    } catch (error: any) {
        return handleError(error);
    }
};

const getItem = (event: APIGatewayProxyEvent): Note => {
    if (!event.body) {
        throw new Error("Missing body");
    }

    return {
        ...JSON.parse(validateBody(event)).Item,
        user_id: getUserId(event.headers),
        user_name: getUserName(event.headers),
        note_id: getUserId(event.headers) + ':' + uuidv4(),
        timestamp: moment().unix(),
        expires: moment().add(90, 'days').unix(),
    };
}
