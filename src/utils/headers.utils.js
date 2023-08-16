const getResponseHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
});

const getUserId = (headers) => headers.app_user_id;

const getUserName = (headers) => headers.app_user_name;

module.exports = { getResponseHeaders, getUserId, getUserName };
