const handler = require('./handler');
const route = require('./route');


module.exports = {
    name: 'album plugin',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const albumhandler = new handler(service, validator)
        server.route(route(albumhandler))
    }
}