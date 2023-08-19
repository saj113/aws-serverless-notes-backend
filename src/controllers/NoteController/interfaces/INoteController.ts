import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export interface INoteController {
    createNote: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
    updateNote: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
    getNote: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
    getNotes: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
    deleteNote: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;
}
