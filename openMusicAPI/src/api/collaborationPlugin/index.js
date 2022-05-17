const handler = require("./handler");
const route = require("./route");

module.exports = {
	name: "collaboration plugin",
	version: "1.0.0",
	register: async (server, { service, validator, playlistsService }) => {
		const Handler = new handler(service, validator, playlistsService);
		server.route(route(Handler));
	}
};
