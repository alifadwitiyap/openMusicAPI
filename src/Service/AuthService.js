const { nanoid } = require("nanoid")
const { Pool } = require("pg")
const bcrypt = require("bcrypt")
const responseError = require("../exception/responseError")
const tokenizer = require("../util/tokenizer")

class AuthService {
	constructor() {
		this._db = new Pool()
	}

	async registerUser({ username, password, fullname }) {
		const id = `user-${nanoid(16)}`
		const hashedPassword = await bcrypt.hash(password, 10)
		const query = {
			text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
			values: [id, username, hashedPassword, fullname]
		}
		const result = await this._db.query(query)

		if (!result.rows.length) {
			throw new responseError("User gagal ditambahkan", 400)
		}

		return result.rows[0].id
	}

	async loginUser({ username, password }) {
		const query = {
			text: "SELECT id, password FROM users WHERE username = $1",
			values: [username]
		}
		const result = await this._db.query(query)

		if (!result.rows.length) {
			throw new responseError("Kredensial yang Anda berikan salah", 401)
		}

		const { id, password: hashedPassword } = result.rows[0]
		const match = await bcrypt.compare(password, hashedPassword)

		if (!match) {
			throw new responseError("Kredensial yang Anda berikan salah", 401)
		}

		const accessToken = tokenizer.generateAccessToken({ userId: id })
		const refreshToken = tokenizer.generateRefreshToken({ userId: id })
		await this.addRefreshToken(refreshToken)

		return {
			accessToken,
			refreshToken
		}
	}

	async updateAccessToken({ refreshToken }) {
		await this.verifyRefreshToken(refreshToken)
		const { userId: id } = tokenizer.decodeToken(refreshToken)
		const accessToken = tokenizer.generateAccessToken({ id })

		return {
			accessToken
		}
	}

	async logoutUser({ refreshToken }) {
		await this.verifyRefreshToken(refreshToken)
		await this.deleteRefreshToken(refreshToken)
	}

	//----------------------------------------------------------------------------------------------------------------------------------------------------
	// Token Method
	//----------------------------------------------------------------------------------------------------------------------------------------------------
	async addRefreshToken(token) {
		const query = {
			text: "INSERT INTO authentications VALUES($1)",
			values: [token]
		}

		await this._db.query(query)
	}

	async verifyRefreshToken(token) {
		const query = {
			text: "SELECT token FROM authentications WHERE token = $1",
			values: [token]
		}

		const result = await this._db.query(query)

		if (!result.rows.length) {
			throw new responseError("Refresh token tidak valid", 400)
		}
	}

	async deleteRefreshToken(token) {
		const query = {
			text: "DELETE FROM authentications WHERE token = $1",
			values: [token]
		}

		await this._db.query(query)
	}
}

module.exports = AuthService
