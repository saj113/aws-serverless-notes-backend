const AWS = require('aws-sdk');
const {getResponseHeaders, getUserId, getUserName} = require('../utils/headers.utils');
const uuid = require('uuid');
const moment = require('moment');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        const item = getItem(event);
        await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            headers: getResponseHeaders(),
            body: JSON.stringify(item)
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

const getItem = (event) => ({
    ...JSON.parse(event.body).Item,
    user_id: getUserId(event.headers),
    user_name: getUserName(event.headers),
    note_id: getUserId(event.headers) + ':' + uuid.v4(),
    timestamp: moment().unix(),
    expires: moment().add(90, 'days').unix(),
});
