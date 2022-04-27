const responseError = require('../exception/responseError');


module.exports = async (request, h) => {
    const { response } = request;

    if (response instanceof responseError) {
        const newResponse = h.response({
            status: 'fail',
            message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
    }

    return response.continue || response;
}