const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const getSongsMapper = require("../util/getSongsMapper")
const responseError = require("../exception/responseError")

class AlbumService {
	constructor() {
		this._db = new Pool()
	}

	async addAlbum({ name, year }) {
		const id = "album-" + nanoid(16)
		const query = {
			text: "INSERT INTO albums VALUES ($1,$2,$3) RETURNING id",
			values: [id, name, year]
		}
		const result = await this._db.query(query)
		if (result.rows.length < 1) {
			throw new responseError("Album gagal ditambahkan", 400)
		}
		return result.rows[0].id
	}

	async getAlbumByID({ id }) {
		const query = {
			text: "SELECT * FROM albums WHERE id = $1",
			values: [id]
		}
		const result = await this._db.query(query)
		if (result.rows.length < 1) {
			throw new responseError("Album tidak ditemukan", 404)
		}
		return result.rows[0]
	}

	async updateAlbumByID({ id }, { name, year }) {
		const query = {
			text: "UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id",
			values: [name, year, id]
		}
		const result = await this._db.query(query)
		if (result.rows.length < 1) {
			throw new responseError("Album tidak ditemukan", 404)
		}
	}

	async deleteAlbumByID({ id }) {
		const query = {
			text: "DELETE FROM albums WHERE id=$1 RETURNING id",
			values: [id]
		}
		const result = await this._db.query(query)
		if (result.rows.length < 1) {
			throw new responseError("Album tidak ditemukan", 404)
		}
	}

	async getSongsByAlbumId({ id }) {
		const query = {
			text: "SELECT * FROM songs WHERE album_id = $1",
			values: [id]
		}
		const result = await this._db.query(query)
		return result.rows.map(getSongsMapper)
	}
}

module.exports = AlbumService
