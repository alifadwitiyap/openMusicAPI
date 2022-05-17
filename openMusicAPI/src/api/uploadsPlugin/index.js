const routes = require("./route");
const handler = require("./handler");

module.exports = {
	name: "uploads",
	version: "1.0.0",
	register: async (server, { service, validator }) => {
		const Handler = new handler(service, validator);
		server.route(routes(Handler));
	}
};
