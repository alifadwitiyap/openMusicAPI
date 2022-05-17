const routes = handler => [
	{
		method: "POST",
		path: "/export/playlists/{playlistId}",
		handler: handler.postExportPlaylistHandler,
		options: {
			auth: "openMusicJwt"
		}
	}
];

module.exports = routes;
