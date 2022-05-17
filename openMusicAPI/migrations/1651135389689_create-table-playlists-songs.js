/* eslint-disable camelcase */

exports.shorthands = {
	id: {
		type: "VARCHAR(50)",
		primaryKey: true
	}
}

exports.up = pgm => {
	pgm.createTable("playlists_songs", {
		id: "id",
		playlist_id: {
			type: "TEXT",
			references: "playlists",
			onDelete: "cascade"
		},
		song_id: {
			type: "TEXT",
			references: "songs",
			onDelete: "cascade"
		}
	})
}

exports.down = pgm => {
	pgm.dropTable("playlists_songs")
}
