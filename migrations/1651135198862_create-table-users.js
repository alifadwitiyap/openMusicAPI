exports.shorthands = {
	text: {
		type: "TEXT",
		notNull: true
	},
	id: {
		type: "VARCHAR(50)",
		primaryKey: true
	},
	username: {
		type: "TEXT",
		notNull: true,
		unique: true
	}
}

exports.up = pgm => {
	pgm.createTable("users", {
		id: "id",
		username: "username",
		password: "text",
		fullname: "text"
	})
}

exports.down = pgm => {
	pgm.dropTable("users")
}
