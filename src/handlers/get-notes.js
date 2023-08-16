
const AWS = require('aws-sdk');
const {getResponseHeaders, getUserId} = require('../utils/headers.utils');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        const query = event.QueryStringParameters;
        const limit = query && query.limit ? parseInt(query.limit) : 5;
        const user_id = getUserId(event.headers);
        const params = {
            TableName: tableName,
            KeyConditionExpression: 'user_id = :uid',
            ExpressionAttributeValues: {
                ":uid": user_id,
            },
            Limit: limit,
            ScanIndexForward: false,
        };
        
        let startTimestamp = query && query.start ? parseInt(query.start) : 0;
        if (startTimestamp > 0) {
            params.ExclusiveStartKey = {
                user_id,
                timestamp: startTimestamp
            };
        }

        const data = await dynamodb.query(params).promise();
        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(data)
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
