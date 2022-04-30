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
		type: "SMALLINT",
		notNull: true
	}
}

exports.up = pgm => {
	pgm.createTable("albums", {
		id: "id",
		name: "text",
		year: "number"
	})
}

exports.down = pgm => {
	pgm.dropTable("albums")
}
