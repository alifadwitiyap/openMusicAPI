const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const responseError = require("../exception/responseError");

class LikesService {
	constructor(cacheService) {
		this._db = new Pool();
		this._cacheService = cacheService;
	}

	async isAlbumExist(albumId) {
		const query = {
			text: "SELECT * FROM albums WHERE id=$1",
			values: [albumId]
		};
		const result = await this._db.query(query);

		if (result.rows.length < 1) {
			throw new responseError("Album tidak ditemukan", 404);
		}
	}

	async countLike(albumId) {
		try {
			const result = await this._cacheService.get(`likes:${albumId}`);
			return { count: result, source: "cache" };
		} catch (error) {
			const query = {
				text: "SELECT * FROM  user_album_likes WHERE album_id=$1",
				values: [albumId]
			};
			const result = await this._db.query(query);
			await this._cacheService.set(`likes:${albumId}`, result.rows.length);

			return { count: result.rows.length, source: "database" };
		}
	}

	async likeAlbum(albumId, userId) {
		const query = {
			text: "SELECT * FROM  user_album_likes WHERE user_id=$1 AND album_id=$2",
			values: [userId, albumId]
		};
		const result = await this._db.query(query);
		await this._cacheService.delete(`likes:${albumId}`);

		if (result.rows.length < 1) {
			this._like(albumId, userId);
			return `like berhasil ditambahkan`;
		}
		this._unlike(albumId, userId);
		return `like berhasi dihapuskan`;
	}

	async _like(albumId, userId) {
		const id = "Like-" + nanoid(16);
		const query = {
			text: "INSERT INTO user_album_likes VALUES ($1,$2,$3) RETURNING id",
			values: [id, userId, albumId]
		};
		const result = await this._db.query(query);

		if (result.rows.length < 1) {
			throw new responseError("like gagal ditambahkan", 400);
		}
	}
	async _unlike(albumId, userId) {
		const query = {
			text: "DELETE FROM user_album_likes WHERE user_id=$1 AND album_id=$2 RETURNING id",
			values: [userId, albumId]
		};
		const result = await this._db.query(query);

		if (result.rows.length < 1) {
			throw new responseError("like gagal dihapuskan", 400);
		}
	}
}

module.exports = LikesService;
