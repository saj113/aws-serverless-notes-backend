import {APIGatewayProxyResult} from 'aws-lambda';
import {diContainer} from '../container/diContainer';
import {apiGatewayResult} from './apiGatewayProxyResult.utils';

export const handleApiGatewayEvent = async <T>(
    controllerContainerKey: string,
    controllerRequest: (controller: T) => Promise<APIGatewayProxyResult>): Promise<APIGatewayProxyResult> => {
    try {
        const controller = diContainer.resolve<T>(controllerContainerKey);
        return await controllerRequest(controller);
    } catch (error: unknown) {
        return apiGatewayResult(
            500,
            JSON.stringify({
                error: error instanceof Error ? error.name : 'Exception',
                message: error instanceof Error ? error.message : 'Unknown error'
            }));
    }
}
