const hapi = require("@hapi/hapi");
const laabr = require("laabr");
const jwt = require("@hapi/jwt");
const path = require("path");
const Inert = require("@hapi/inert");

const albumPlugin = require("./api/albumPlugin");
const albumService = require('./Service/albumService');


const songsPlugin = require("./api/songsPlugin");
const songService = require('./Service/songService');


const authPlugin = require("./api/authPlugin");
const authService = require('./Service/authService');


const playlistPlugin = require("./api/playlistPlugin");
const playlistsService = require('./Service/playlistsService');


const collaborationPlugin = require("./api/collaborationPlugin");
const collaborationService = require('./Service/collaborationService');


const exportPlugin = require("./api/exportPlugin");
const exportProducerService = require('./Service/exportProducerService');


const uploadsPlugin = require("./api/uploadsPlugin");
const storageService = require('./Service/storageService');


const likesPlugin = require("./api/likesPlugin");
const likesService = require('./Service/likesService');


const validator = require("./Validator");
const catchError = require("./util/catchError");
const cacheService = require('./Service/cacheService');


require("dotenv").config();
const init = async () => {
	//definisikan service
	const album_service = new albumService();
	const song_service = new songService();
	const auth_service = new authService();
	const collaboration_service = new collaborationService();
	const playlists_service = new playlistsService(collaboration_service);
	const export_producer_service = new exportProducerService();
	const storage_service = new storageService(path.resolve(__dirname, "api/uploadsPlugin/file/images"));
	const cache_service = new cacheService();
	const likes_service = new likesService(cache_service);

	//definisikan server
	const server = hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"]
			}
		}
	});

	// logger;
	if (process.env.NODE_ENV === "development") {
		await server.register({
			plugin: laabr,
			options: {
				colored: true,
				formats: {
					onPostStart: ":message in :environment[NODE_ENV] mode at :host[uri] ",
					response: "(:responseTime ms) :method :url :status :payload "
				}
			}
		});
	} else {
		console.log(`server started in ${process.env.NODE_ENV} mode at ${server.uri}`);
	}

	// registrasi plugin eksternal
	await server.register([
		{
			plugin: jwt
		},
		{
			plugin: Inert
		}
	]);

	// mendefinisikan strategy autentikasi jwt
	server.auth.strategy("openMusicJwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_SK,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE
		},
		validate: artifacts => ({
			isValid: true,
			credentials: {
				id: artifacts.decoded.payload.userId
			}
		})
	});

	//register plugin local
	await server.register([
		{
			plugin: albumPlugin,
			options: {
				service: album_service,
				validator
			}
		},
		{
			plugin: songsPlugin,
			options: {
				service: song_service,
				validator
			}
		},
		{
			plugin: authPlugin,
			options: {
				service: auth_service,
				validator
			}
		},
		{
			plugin: playlistPlugin,
			options: {
				service: playlists_service,
				validator
			}
		},
		{
			plugin: collaborationPlugin,
			options: {
				service: collaboration_service,
				playlistsService: playlists_service,
				validator
			}
		},
		{
			plugin: exportPlugin,
			options: {
				service: export_producer_service,
				playlistsService: playlists_service,
				validator
			}
		},
		{
			plugin: uploadsPlugin,
			options: {
				service: storage_service,
				validator
			}
		},
		{
			plugin: likesPlugin,
			options: {
				service: likes_service
			}
		}
	]);

	// menangkap semua error
	server.ext("onPreResponse", catchError);

	await server.start();
};

init();
