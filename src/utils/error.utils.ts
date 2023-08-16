import { getResponseHeaders } from './headers.utils';

export const handleError = (error: any) => ({
    statusCode: error.statusCode ? error.statusCode : 500,
    headers: getResponseHeaders(),
    body: JSON.stringify({
        error: error?.name ? error.name : 'Exception',
        message: error?.message ? error.message : 'Unknown error'
    })
});
