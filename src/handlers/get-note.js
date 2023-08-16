const AWS = require('aws-sdk');
const {getResponseHeaders, getUserId} = require('../utils/headers.utils');
const _ = require('underscore');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        const note_id = decodeURIComponent(event.pathParameters.note_id);
        const params = {
            TableName: tableName,
            IndexName: tableName + '-gsi-1',
            KeyConditionExpression: 'note_id = :note_id',
            ExpressionAttributeValues: {
                ":note_id": note_id,
            },
            Limit: 1,
        };
        const data = await dynamodb.query(params).promise();
        if (!_.isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            };
        }
        return {
            statusCode: 404,
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
