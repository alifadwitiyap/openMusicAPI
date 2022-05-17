module.exports = handler => [
	{
		method: "POST",
		path: "/users",
		handler: handler.postRegisterUser
	},
	{
		method: "POST",
		path: "/authentications",
		handler: handler.postLoginUser
	},
	{
		method: "PUT",
		path: "/authentications",
		handler: handler.putAccessToken
	},
	{
		method: "DELETE",
		path: "/authentications",
		handler: handler.deleteLogoutUser
	}
];
