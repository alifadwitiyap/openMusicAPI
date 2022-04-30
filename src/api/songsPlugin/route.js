module.exports = songHandler => [
	{
		method: "POST",
		path: "/songs",
		handler: songHandler.postSongHandler
	},
	{
		method: "GET",
		path: "/songs",
		handler: songHandler.getSongs
	},
	{
		method: "GET",
		path: "/songs/{id}",
		handler: songHandler.getSongById
	},
	{
		method: "PUT",
		path: "/songs/{id}",
		handler: songHandler.updateSongById
	},
	{
		method: "DELETE",
		path: "/songs/{id}",
		handler: songHandler.deleteSongById
	}
]
