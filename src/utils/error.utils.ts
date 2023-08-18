import {apiGatewayResult} from './apiGatewayProxyResult.utils';

export const handleError = (error: any) =>
    apiGatewayResult(
        error.statusCode ? error.statusCode : 500,
        JSON.stringify({
            error: error?.name ? error.name : 'Exception',
            message: error?.message ? error.message : 'Unknown error'
        }));
