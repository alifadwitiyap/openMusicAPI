/* eslint-disable camelcase */

exports.shorthands = {
    text: {
        type: 'TEXT',
        notNull: true
    },
    id: {
        type: 'VARCHAR(50)',
        primaryKey: true
    }
};

exports.up = pgm => {
    pgm.createTable('playlists_song_activities', {
        id: 'id',
        playlist_id: {
            type: 'TEXT',
            references: 'playlists',
            onDelete: 'cascade',
        },
        song_id: 'text',
        user_id: 'text',
        action: 'text',
        time: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('playlists_song_activities');
};
