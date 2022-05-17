const handler = require("./handler");
const routes = require("./route");

module.exports = {
	name: "likes",
	version: "1.0.0",
	register: async (server, { service }) => {
		const Handler = new handler(service);
		server.route(routes(Handler));
	}
};
