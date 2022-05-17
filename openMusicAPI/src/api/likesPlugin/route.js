const routes = handler => [
	{
		method: "POST",
		path: "/albums/{id}/likes",
		handler: handler.postLikesHandler,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "GET",
		path: "/albums/{id}/likes",
		handler: handler.getLikesCountHandler
	}
];

module.exports = routes;
