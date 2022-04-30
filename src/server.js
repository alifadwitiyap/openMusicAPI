const Hapi = require("@hapi/hapi")
const laabr = require("laabr")
const jwt = require("@hapi/jwt")

const albumPlugin = require("./api/albumPlugin")
const AlbumService = require("./Service/AlbumService")

const songsPlugin = require("./api/songsPlugin")
const SongService = require("./Service/SongService")

const authPlugin = require("./api/authPlugin")
const AuthService = require("./Service/AuthService")

const playlistPlugin = require("./api/playlistPlugin")
const PlaylistsService = require("./Service/PlaylistsService")

const collaborationPlugin = require("./api/collaborationPlugin")
const CollaborationService = require("./Service/CollaborationService")

const validator = require("./Validator")
const catchError = require("./util/catchError")

require("dotenv").config()
const init = async () => {
	//definisikan service
	const albumService = new AlbumService()
	const songService = new SongService()
	const authService = new AuthService()
	const collaborationService = new CollaborationService()
	const playlistsService = new PlaylistsService(collaborationService)

	//definisikan server
	const server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"]
			}
		}
	})

	// logger
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
		})
	} else {
		console.log(
			`server started in ${process.env.NODE_ENV} mode at ${server.uri}`
		)
	}

	// registrasi plugin eksternal
	await server.register([
		{
			plugin: jwt
		}
	])

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
	})

	//register plugin local
	await server.register([
		{
			plugin: albumPlugin,
			options: {
				service: albumService,
				validator: validator
			}
		},
		{
			plugin: songsPlugin,
			options: {
				service: songService,
				validator: validator
			}
		},
		{
			plugin: authPlugin,
			options: {
				service: authService,
				validator: validator
			}
		},
		{
			plugin: playlistPlugin,
			options: {
				service: playlistsService,
				validator: validator
			}
		},
		{
			plugin: collaborationPlugin,
			options: {
				service: collaborationService,
				validator: validator,
				playlistService: playlistsService
			}
		}
	])

	// menangkap semua error
	server.ext("onPreResponse", catchError)

	await server.start()
}

init()
