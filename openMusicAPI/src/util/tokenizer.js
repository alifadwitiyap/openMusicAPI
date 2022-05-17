const Jwt = require("@hapi/jwt");
const responseError = require("../exception/responseError");

const tokenizer = {
	generateAccessToken: payload => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_SK),
	generateRefreshToken: payload => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_SK),
	decodeToken: token => {
		try {
			const artifacts = Jwt.token.decode(token);
			Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_SK);
			const { payload } = artifacts.decoded;
			return payload;
		} catch (error) {
			throw new responseError("Refresh token tidak valid", 400);
		}
	}
};

module.exports = tokenizer;
