import { APIGatewayProxyResult } from 'aws-lambda';
import { getResponseHeaders } from './headers.utils';

export const create200Response = (body: string = ''): APIGatewayProxyResult => ({
    statusCode: 200,
    headers: getResponseHeaders(),
    body: body,
});
export const create404Response = (message: string = ''): APIGatewayProxyResult => ({
    statusCode: 404,
    headers: getResponseHeaders(),
    body: message,
}); 
