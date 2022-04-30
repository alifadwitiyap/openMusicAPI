module.exports = class responseError extends Error {
	constructor(message, statusCode) {
		super(message)
		this.statusCode = statusCode
		this.name = "responseError"
	}
}
