module.exports = handler => [
	{
		method: "POST",
		path: "/collaborations",
		handler: handler.postCollaborationHandler,
		options: {
			auth: "openMusicJwt"
		}
	},
	{
		method: "DELETE",
		path: "/collaborations",
		handler: handler.deleteCollaborationHandler,
		options: {
			auth: "openMusicJwt"
		}
	}
]
