import { APIGatewayProxyEvent } from 'aws-lambda';

export const validateBody = (event: APIGatewayProxyEvent) => {
    if (!event || !event.body) {
        throw new Error('Missing body');
    }
    return event.body;
}

export const validatePassParameter = (event: APIGatewayProxyEvent, parameterName: string): string => {
    if (!event || !event.pathParameters || !event.pathParameters[parameterName]) {
        throw new Error(`Missing path parameter: ${parameterName}`);
    }

    return event.pathParameters[parameterName]!;
};
