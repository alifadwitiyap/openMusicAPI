const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const songMapper = require('../util/songMapper')
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

        return result.rows.map(songMapper)
    }

    async getSongById({ id }) {
        const query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [id]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new NotFoundError("Lagu gagal ditambahkan, id tidak ditemukan")
        }

        return result.rows.map(songMapper)
    }


    async updateSongById({ id }, { title, year, genre, performer, duration, albumId }) {
        const query = {
            text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new NotFoundError("Lagu gagal diupdate, id tidak ditemukan")
        }


    }

    async deleteSongByID({id}){
        const query = {
            text: 'DELETE FROM song WHERE id=$1 RETURNING id',
            values: [id]
        }

        const result = await this._db.query(query)
        if (result.rows.length < 1) {
            throw new NotFoundError("Lagu gagal dihapus, id tidak ditemukan")
        }
    }

}



tes = new songService()
//update song
// testfunc = async ()=>{
//     console.log(await tes.updateSongById({id:"song-g4ZStrDgwpBmHbV-"},{
//         title:'TERUPDATE',
//         year:2012,
//         genre:'TERUPDATE',
//         performer:'TERUPDATE',
//         duration: 999,
//         albumId:'TERUPDATE',
//     }))
// }
//add song
// testfunc = async ()=>{
//     console.log(await tes.addSong({
//         title:'BARU DITAMBAH',
//         year:2012,
//         genre:'BARU DITAMBAH',
//         performer:'BARU DITAMBAH',
//         duration: 999,
//         albumId:'BARU DITAMBAH',
//     }))
// }
//getsong
testfunc = async () => {
    console.log(await tes.deleteSongByID({id:'song-g4ZStrDgwpBmHbV-'}))
}

testfunc()
