/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.createTable("user_album_likes", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true
		},
		user_id: {
			type: "TEXT",
			references: "users",
			onDelete: "cascade"
		},
		album_id: {
			type: "TEXT",
			references: "albums",
			onDelete: "cascade"
		}
	});
};

exports.down = pgm => {
	pgm.dropTable("user_album_likes");
};
