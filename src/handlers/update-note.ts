import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { getUserId, getUserName } from '../utils/headers.utils';
import { create200Response } from '../utils/apiGatewayProxyResult.utils';
import moment from 'moment';
import { validateBody } from '../validators/apiGatewayProxyEventValidators';
import { handleError } from '../utils/error.utils';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE!;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const item = getItem(event);
        await dynamodb.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: '#t = :t',
            ExpressionAttributeNames: {
                '#t': 'timestamp'
            },
            ExpressionAttributeValues: {
                ':t': item.timestamp
            }
        }).promise();

        return create200Response(JSON.stringify(item));
    } catch (error: any) {
        return handleError(error);
    }
};

const getItem = (event: APIGatewayProxyEvent) => ({
    ...JSON.parse(validateBody(event)).Item,
    user_id: getUserId(event.headers),
    user_name: getUserName(event.headers),
    expires: moment().add(90, 'days').unix(),
});
