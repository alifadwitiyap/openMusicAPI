exports.shorthands = {
	text: {
		type: "TEXT",
		notNull: true
	},
	id: {
		type: "VARCHAR(50)",
		primaryKey: true
	},
	number: {
		type: "SMALLINT"
	}
}

exports.up = pgm => {
	pgm.createTable("songs", {
		id: "id",
		title: "text",
		year: "number",
		performer: "text",
		genre: "text",
		duration: "number",
		album_id: {
			type: "TEXT",
			references: "albums",
			onDelete: "cascade"
		}
	})
}

exports.down = pgm => {
	pgm.dropTable("songs")
}
