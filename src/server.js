const Hapi = require('@hapi/hapi');

const AlbumService = require('./Service/AlbumService');
const SongService = require('./Service/SongService');
const validator = require('./Validator')

const album = require('./api/album');
const songs = require('./api/songs');

const catchError = require('./util/catchError');


require('dotenv').config()
const init = async () => {

  const albumService = new AlbumService()
  const songService = new SongService()


  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: [ '*' ],
      },
    },
  });

  await server.register([ {
    plugin: album,
    options: {
      service: albumService,
      validator: validator
    }
  }, {
    plugin: songs,
    options: {
      service: songService,
      validator: validator
    }
  }
  ])

  server.ext('onPreResponse', catchError);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
