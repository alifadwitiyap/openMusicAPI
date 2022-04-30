module.exports = handler => [
	{
		method: "POST",
		path: "/playlists",
		handler: handler.postAddPlaylist,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "GET",
		path: "/playlists",
		handler: handler.getAllPlaylists,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "DELETE",
		path: "/playlists/{id}",
		handler: handler.deletePlaylist,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "POST",
		path: "/playlists/{id}/songs",
		handler: handler.postAddPlaylistSong,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "GET",
		path: "/playlists/{id}/songs",
		handler: handler.getPlaylistSongs,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "DELETE",
		path: "/playlists/{id}/songs",
		handler: handler.deletePlaylistSong,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "GET",
		path: "/playlists/{id}/activities",
		handler: handler.getActivities,
		options: {
			auth: "openMusicJwt"
		}
	}
]
