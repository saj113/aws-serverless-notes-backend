const AWS = require('aws-sdk');
const {getResponseHeaders, getUserId} = require('../utils/headers.utils');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        const timestamp = parseInt(event.pathParameters.timestamp);
        const params = {
            TableName: tableName,
            Key: {
                user_id: getUserId(event.headers),
                timestamp: timestamp,
            },
        };

        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            headers: getResponseHeaders(),
        };
    } catch (error) {
        console.log("Error: ", error);
        return {
            statusCode: error.statusCode ? error.statusCode : 500,
            headers: getResponseHeaders(),
            body: JSON.stringify({
                error: error?.name ? error.name : 'Exception',
                message: error?.message ? error.message : 'Unknown error'
            })
        }
    }
};
