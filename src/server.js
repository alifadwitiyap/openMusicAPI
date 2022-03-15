const Hapi = require('@hapi/hapi');
const AlbumService = require('./Service/AlbumService')
const musicApi = require('./api/MusicAPI')
require('dotenv').config()


const init = async () => {
  const albumService = new AlbumService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: musicApi,
    options: {
      albumService: albumService,
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
