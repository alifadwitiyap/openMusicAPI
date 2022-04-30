const { Pool } = require("pg")
const { nanoid } = require("nanoid")
const responseError = require("../exception/responseError")

require("dotenv").config({ path: "../../.env" })

class PlaylistService {
	constructor(collaborationService) {
		this._db = new Pool()
		this._collaborationService = collaborationService
	}

	async addPlaylist({ name }, { id: ownerId }) {
		const id = "playlist-" + nanoid(16)
		const query = {
			text: "INSERT INTO playlists VALUES ($1,$2,$3) RETURNING id",
			values: [id, name, ownerId]
		}
		const result = await this._db.query(query)

		if (result.rows.length < 1) {
			throw new responseError("playlist gagal ditambahkan", 400)
		}

		return result.rows[0].id
	}

	async getPlaylists({ id: ownerId }) {
		const query = {
			text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            LEFT JOIN users ON playlists.owner = users.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1
            GROUP BY playlists.id, users.username
            `,
			values: [ownerId]
		}
		const result = await this._db.query(query)

		return result.rows
	}

	async deletePlaylist({ id: playlistId }) {
		const query = {
			text: "DELETE FROM playlists WHERE id=$1 RETURNING id",
			values: [playlistId]
		}
		const result = await this._db.query(query)

		if (result.rows.length < 1) {
			throw new responseError("Playlist gagal dihapus, id tidak ditemukan", 404)
		}
	}

	async addSongToPlaylist({ id: playlistId }, { songId }) {
		try {
			const id = "playlistSong-" + nanoid(16)
			const query = {
				text: "INSERT INTO playlists_songs VALUES ($1,$2,$3) RETURNING id",
				values: [id, playlistId, songId]
			}
			await this._db.query(query)
		} catch (error) {
			throw new responseError("Lagu gagal ditambahkan kedalam playlist", 404)
		}
	}

	async getPlaylistSongs({ id: playlistId }, { id: ownerId }) {
		let playlist = await this.getPlaylists({ id: ownerId })

		playlist = playlist.find(el => el.id == playlistId)
		const query = {
			text: `SELECT songs.id, songs.title, songs.performer FROM playlists_songs 
            INNER JOIN songs ON playlists_songs.song_id = songs.id
            INNER JOIN playlists ON playlists_songs.playlist_id = playlists.id
            WHERE playlists_songs.playlist_id = $1`,
			values: [playlistId]
		}
		const result = await this._db.query(query)

		playlist.songs = result.rows

		return playlist
	}

	async deletePlaylistSongs({ id: playlistId }, { songId }) {
		const query = {
			text:
				"DELETE FROM playlists_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING id",
			values: [playlistId, songId]
		}
		const result = await this._db.query(query)

		if (result.rows.length < 1) {
			throw new responseError("Lagu gagal dihapus", 400)
		}
	}

	async verifyPlaylistOwner({ id: playlistId }, { id: ownerId }) {
		const query = {
			text: "SELECT * FROM playlists WHERE id = $1",
			values: [playlistId]
		}

		const result = await this._db.query(query)

		if (!result.rows.length) {
			throw new responseError(
				"Playlist tidak ditemukan gagal memverifikasi   ",
				404
			)
		}

		const playlist = result.rows[0]

		if (playlist.owner !== ownerId) {
			throw new responseError("Anda tidak berhak mengakses resource ini", 403)
		}
	}

	async verifyPlaylistAccess(playlistId, userId) {
		try {
			await this.verifyPlaylistOwner(playlistId, userId)
		} catch (error) {
			if (error.statusCode == 404) {
				throw error
			}

			try {
				await this._collaborationService.verifyCollaborator(playlistId, userId)
			} catch {
				throw error
			}
		}
	}

	async addActivities({ id: playlistId }, { songId }, { id: userId }, action) {
		const id = "activity-" + nanoid(16)
		const query = {
			text:
				"INSERT INTO playlists_song_activities VALUES ($1,$2,$3,$4,$5) RETURNING id",
			values: [id, playlistId, songId, userId, action]
		}
		await this._db.query(query)
	}

	async getActivities({ id: playlistId }) {
		const query = {
			text: `SELECT users.username, songs.title, playlists_song_activities.action, playlists_song_activities.time  FROM playlists_song_activities
            LEFT JOIN songs ON playlists_song_activities.song_id = songs.id
            LEFT JOIN users ON playlists_song_activities.user_id = users.id
            WHERE playlists_song_activities.playlist_id = $1
            `,
			values: [playlistId]
		}

		const result = await this._db.query(query)
		return result.rows
	}
}

module.exports = PlaylistService
