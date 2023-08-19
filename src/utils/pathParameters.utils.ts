import {APIGatewayProxyEventPathParameters} from 'aws-lambda/trigger/api-gateway-proxy';

export const getParam = (parameters: APIGatewayProxyEventPathParameters | null, parameterName: string): string | null => {
    if (!parameters || !parameters[parameterName]) {
        return null;
    }

    return parameters[parameterName]!;
}
