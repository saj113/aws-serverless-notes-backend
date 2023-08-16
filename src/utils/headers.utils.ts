import { APIGatewayProxyEventHeaders } from 'aws-lambda/trigger/api-gateway-proxy';

export const getResponseHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
});

export const getUserId = (headers: APIGatewayProxyEventHeaders): string | undefined => headers.app_user_id;

export const getUserName = (headers: APIGatewayProxyEventHeaders): string | undefined => headers.app_user_name;
