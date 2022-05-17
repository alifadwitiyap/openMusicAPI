const handler = require("./handler");
const route = require("./route");

module.exports = {
	name: "playlist plugin",
	version: "1.0.0",
	register: async (server, { service, validator }) => {
		const Handler = new handler(service, validator);
		server.route(route(Handler));
	}
};
