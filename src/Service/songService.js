const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const getSongbyIdMapper = require('../util/getSongByIdMapper')
const getSongsMapper = require('../util/getSongsMapper')
const responseError = require('../exception/responseError');



class SongService {
    constructor() {
        this._db = new Pool()
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = "song-" + nanoid(16)
        const query = {
            text: 'INSERT INTO songs VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            values: [ id, title, year, performer, genre, duration, albumId ]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new responseError("Lagu gagal ditambahkan", 400)
        }
        return result.rows[ 0 ].id
    }

    async getSongs({ title, performer }) {
        let query
        if (title && performer) {
            query = {
                text: 'SELECT * FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2',
                values: [ title + '%', performer + '%' ]
            }
        } else if (title) {
            query = {
                text: 'SELECT * FROM songs WHERE LOWER(title) LIKE $1',
                values: [ title + '%' ]
            }
        } else if (performer) {
            query = {
                text: 'SELECT * FROM songs WHERE LOWER(performer) LIKE $1',
                values: [ performer + '%' ]
            }
        } else {
            query = {
                text: 'SELECT * FROM songs',
            }
        }


        const result = await this._db.query(query)
        return result.rows.map(getSongsMapper)
    }

    async getSongById({ id }) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [ id ]
        }
        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new responseError("Lagu gagal ditambahkan, id tidak ditemukan", 404)
        }

        return result.rows.map(getSongbyIdMapper)[ 0 ]
    }


    async updateSongById({ id }, { title, year, genre, performer, duration, albumId }) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
            values: [ title, year, genre, performer, duration, albumId, id ]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new responseError("Lagu gagal diupdate, id tidak ditemukan", 404)
        }


    }

    async deleteSongByID({ id }) {
        const query = {
            text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
            values: [ id ]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new responseError("Lagu gagal dihapus, id tidak ditemukan", 404)
        }
    }

}

module.exports = SongService