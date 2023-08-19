import {APIGatewayProxyResult} from 'aws-lambda';
import {diContainer} from '../container/diContainer';
import {apiGatewayResult} from './apiGatewayProxyResult.utils';

export const handleApiGatewayEvent = async <T>(
    controllerContainerKey: string,
    controllerRequest: (controller: T) => Promise<APIGatewayProxyResult>): Promise<APIGatewayProxyResult> => {
    try {
        const controller = diContainer.resolve<T>(controllerContainerKey);
        return await controllerRequest(controller);
    } catch (error: any) {
        return apiGatewayResult(
            error.statusCode ? error.statusCode : 500,
            JSON.stringify({
                error: error?.name ? error.name : 'Exception',
                message: error?.message ? error.message : 'Unknown error'
            }));
    }
}
