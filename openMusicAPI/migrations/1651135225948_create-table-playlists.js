exports.shorthands = {
	text: {
		type: "TEXT",
		notNull: true
	},
	id: {
		type: "VARCHAR(50)",
		primaryKey: true
	}
}

exports.up = pgm => {
	pgm.createTable("playlists", {
		id: "id",
		name: "text",
		owner: {
			type: "TEXT",
			references: "users",
			onDelete: "cascade"
		}
	})
}

exports.down = pgm => {
	pgm.dropTable("playlists")
}
