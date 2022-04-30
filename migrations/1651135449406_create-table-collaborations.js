exports.up = pgm => {
    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'TEXT',
            references: 'playlists',
            onDelete: 'cascade',
        },
        user_id: {
            type: 'TEXT',
            references: 'users',
            onDelete: 'cascade',
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('collaborations');
};
