const handler = require("./handler");
const routes = require("./route");

module.exports = {
	name: "exports",
	version: "1.0.0",
	register: async (server, { service, playlistsService, validator }) => {
		const Handler = new handler(service, playlistsService, validator);
		server.route(routes(Handler));
	}
};
