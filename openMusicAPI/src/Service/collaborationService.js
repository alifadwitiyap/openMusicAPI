const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const responseError = require("../exception/responseError");

class CollaborationsService {
	constructor() {
		this._pool = new Pool();
	}

	async addCollaboration({ playlistId, userId }) {
		const id = `collab-${nanoid(16)}`;
		const query = {
			text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
			values: [id, playlistId, userId]
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new responseError("Kolaborasi gagal ditambahkan", 400);
		}
		return result.rows[0].id;
	}

	async deleteCollaboration({ playlistId, userId }) {
		const query = {
			text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
			values: [playlistId, userId]
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new responseError("Kolaborasi gagal dihapus", 400);
		}
	}

	async verifyCollaborator({ id: playlistId }, { id: ownerId }) {
		const query = {
			text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
			values: [playlistId, ownerId]
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new responseError("Kolaborasi gagal diverifikasi", 400);
		}
	}

	async checkTargetCollab({ userId }) {
		const query = {
			text: "SELECT * FROM users WHERE id = $1",
			values: [userId]
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new responseError("Target user tidak ditemukann", 404);
		}
	}
}

module.exports = CollaborationsService;
