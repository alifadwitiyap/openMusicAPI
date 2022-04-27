const responseError = require('../exception/responseError');

const schema = require('./schema')

module.exports = (payload, marker) => {
    let validationResult
    if (marker === 'album') {
        validationResult = schema.albumSchema.validate(payload)
    } else if (marker === 'song') {
        validationResult = schema.songSchema.validate(payload)
    } else {
        throw new responseError('invalid marker', 400)
    }
    if (validationResult.error) {
        throw new responseError(validationResult.error.message, 400)
    }
}



