import { APIGatewayProxyResult } from 'aws-lambda';
import { getResponseHeaders } from './headers.utils';

type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;
export const apiGatewayResult = (statusCode: StatusCode = 200, body: string = ''): APIGatewayProxyResult => ({
    statusCode,
    headers: getResponseHeaders(),
    body: body,
});
