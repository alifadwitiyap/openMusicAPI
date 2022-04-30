const responseError = require("../exception/responseError")

const schema = require("./schema")

module.exports = (payload, marker) => {
	let validationResult
	switch (marker) {
	case "album":
		validationResult = schema.albumSchema.validate(payload)
		break
	case "song":
		validationResult = schema.songSchema.validate(payload)
		break
	case "register":
		validationResult = schema.registerSchema.validate(payload)
		break
	case "login":
		validationResult = schema.loginSchema.validate(payload)
		break
	case "token":
		validationResult = schema.tokenSchema.validate(payload)
		break
	case "playlist":
		validationResult = schema.playlistSchema.validate(payload)
		break
	case "playlistInput":
		validationResult = schema.playlistInputSchema.validate(payload)
		break
	default:
		throw new responseError("invalid marker", 500)
	}

	if (validationResult.error) {
		throw new responseError(validationResult.error.message, 400)
	}
}
