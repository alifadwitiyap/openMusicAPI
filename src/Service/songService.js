const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const NotFoundError = require('../exception/NotFoundError');
const InvariantError = require('../exception/InvariantError');
require('dotenv').config()


class songService {
    constructor() {
        this._db = new Pool()
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = "song-" + nanoid(16)
        const query = {
            text: 'INSERT INTO song VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId]
        }

        const result = await this._db.query(query)
        console.log(result.rows.length < 1);
        if (result.rows.length < 1) {
            throw new InvariantError("Lagu gagal ditambahkan")
        }
        return result.rows[0].id
    }

    async getSongs() {
        const query = {
            text: 'SELECT * FROM song',
        }

        const result = await this._db.query(query)

        return result.rows
    }

    async getSongById({ id }) {
        const query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [id]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new NotFoundError("Lagu gagal ditambahkan")
        }

        return result.rows
    }


}



tes = new songService()

testfunc = async ()=>{
    console.log(await tes.addSong({
        title:'title',
        year:2012,
        genre:'genre',
        performer:'performer',
        duration: 999,
        albumId:'albumId',
    }))
}

// testfunc = async ()=>{
//     console.log(await tes.getSongById({
//         id:"song-MbwrmdvJvE2OS"
//     }))
// }

testfunc()
