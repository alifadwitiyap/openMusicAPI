module.exports = class playlistHandler {
	constructor(service, validator) {
		this._service = service
		this._validator = validator

		this.postAddPlaylist = this.postAddPlaylist.bind(this)
		this.getAllPlaylists = this.getAllPlaylists.bind(this)
		this.deletePlaylist = this.deletePlaylist.bind(this)
		this.postAddPlaylistSong = this.postAddPlaylistSong.bind(this)
		this.getPlaylistSongs = this.getPlaylistSongs.bind(this)
		this.deletePlaylistSong = this.deletePlaylistSong.bind(this)
		this.getActivities = this.getActivities.bind(this)
	}

	async postAddPlaylist(request, h) {
		this._validator(request.payload, "playlist")
		const playlistId = await this._service.addPlaylist(
			request.payload,
			request.auth.credentials
		)

		return h
			.response({
				status: "success",
				data: { playlistId }
			})
			.code(201)
	}

	async getAllPlaylists(request, h) {
		const playlists = await this._service.getPlaylists(request.auth.credentials)

		return h
			.response({
				status: "success",
				data: { playlists }
			})
			.code(200)
	}

	async deletePlaylist(request, h) {
		await this._service.verifyPlaylistOwner(
			request.params,
			request.auth.credentials
		)
		await this._service.deletePlaylist(request.params)

		return h
			.response({
				status: "success",
				message: "Playlist berhasil dihapus"
			})
			.code(200)
	}

	async postAddPlaylistSong(request, h) {
		this._validator(request.payload, "playlistInput")
		await this._service.verifyPlaylistAccess(
			request.params,
			request.auth.credentials
		)
		await this._service.addSongToPlaylist(request.params, request.payload)
		await this._service.addActivities(
			request.params,
			request.payload,
			request.auth.credentials,
			"add"
		)

		return h
			.response({
				status: "success",
				message: "Lagu berhasil di tambahkan ke dalam playlist"
			})
			.code(201)
	}

	async getPlaylistSongs(request, h) {
		await this._service.verifyPlaylistAccess(
			request.params,
			request.auth.credentials
		)
		const playlist = await this._service.getPlaylistSongs(
			request.params,
			request.auth.credentials
		)

		return h
			.response({
				status: "success",
				data: { playlist }
			})
			.code(200)
	}

	async deletePlaylistSong(request, h) {
		await this._service.verifyPlaylistAccess(
			request.params,
			request.auth.credentials
		)
		await this._service.deletePlaylistSongs(request.params, request.payload)
		await this._service.addActivities(
			request.params,
			request.payload,
			request.auth.credentials,
			"delete"
		)

		return h
			.response({
				status: "success",
				message: "Lagu berhasil di hapus dari playlist"
			})
			.code(200)
	}

	async getActivities(request, h) {
		await this._service.verifyPlaylistAccess(
			request.params,
			request.auth.credentials
		)
		const activities = await this._service.getActivities(request.params)
		const data = { playlistId: request.params.id }

		data.activities = activities

		return h
			.response({
				status: "success",
				data
			})
			.code(200)
	}
}
