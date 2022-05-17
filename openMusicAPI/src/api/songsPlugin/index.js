const route = require("./route");
const handler = require("./handler");

module.exports = {
	name: "songs plugin",
	version: "1.0.0",
	register: async (server, { service, validator }) => {
		const Handler = new handler(service, validator);
		server.route(route(Handler));
	}
};
