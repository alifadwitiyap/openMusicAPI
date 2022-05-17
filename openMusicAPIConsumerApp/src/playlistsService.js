require('dotenv').config();
const { Pool } = require('pg');

class PlaylistsService {
	constructor() {
		this._db = new Pool();

	}

	async _getPlaylistSongs(playlistId) {

		const query = {
			text: `SELECT songs.id, songs.title, songs.performer FROM playlists_songs 
            INNER JOIN songs ON playlists_songs.song_id = songs.id
            INNER JOIN playlists ON playlists_songs.playlist_id = playlists.id
            WHERE playlists_songs.playlist_id = $1`,
			values: [ playlistId ]
		};
		const result = await this._db.query(query);

		return result.rows;
	}

	async getPlaylists(playlistId) {
		const query = {
			text: `SELECT id, name FROM playlists
            WHERE id = $1`,
			values: [ playlistId ]
		};
		const result = await this._db.query(query);
		const [ playlistInfo ] = result.rows

		const songs = await this._getPlaylistSongs(playlistId)
		const playlist = { ...playlistInfo, songs }

		return playlist;
	}
}

module.exports = PlaylistsService;