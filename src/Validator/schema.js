const joi = require("joi")

module.exports = {
	albumSchema: joi.object({
		name: joi.string().required(),
		year: joi.number().required()
	}),
	songSchema: joi.object({
		title: joi.string().required(),
		year: joi.number().required(),
		genre: joi.string().required(),
		performer: joi.string().required(),
		duration: joi.number(),
		albumId: joi.string()
	}),
	registerSchema: joi.object({
		username: joi.string().required(),
		password: joi.string().required(),
		fullname: joi.string().required()
	}),
	loginSchema: joi.object({
		username: joi.string().required(),
		password: joi.string().required()
	}),
	tokenSchema: joi.object({
		refreshToken: joi.string().required()
	}),
	playlistSchema: joi.object({
		name: joi.string().required()
	}),
	playlistInputSchema: joi.object({
		songId: joi.string().required()
	})
}
