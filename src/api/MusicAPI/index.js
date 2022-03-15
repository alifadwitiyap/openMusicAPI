const albumhandler = require('./albumHandler')
const songhandler = require('./songHandler')
const routes = require('./routes')

module.exports = {
    name: 'openmusic API',
    version: '1.0.0',
    register: async (server, { albumService,songService }) => {
        const albumHandler = new albumhandler(albumService)
        const songHandler = new songhandler(songService)
        server.route(routes(albumHandler,songHandler))
    }
}