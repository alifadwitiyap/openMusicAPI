const Handler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'openmusic API',
    version: '1.0.0',
    register: async (server, { albumService }) => {
        const handler = new Handler(albumService)
        server.route(routes(handler))
    }
}