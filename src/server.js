const Hapi = require('@hapi/hapi');
const AlbumService = require('./Service/AlbumService')
const SongService = require('./Service/SongService')
const musicApi = require('./api/MusicAPI')
const validator = require('./Validator')
require('dotenv').config()


const init = async () => {
  const albumService = new AlbumService()
  const songService = new SongService()
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
      songService: songService,
      validator:validator
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
