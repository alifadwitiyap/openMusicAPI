const handler = require("./handler")
const route = require("./route")

module.exports = {
	name: "collaboration plugin",
	version: "1.0.0",
	register: async (server, { service, validator, playlistService }) => {
		const Handler = new handler(service, validator, playlistService)
		server.route(route(Handler))
	}
}
