
module.exports = class SongHandler {
    constructor(songService, validator) {
        this._songService = songService;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongs = this.getSongs.bind(this);
        this.getSongById = this.getSongById.bind(this);
        this.updateSongById = this.updateSongById.bind(this);
        this.deleteSongById = this.deleteSongById.bind(this);
    }

    async postSongHandler(request, h) {
        this._validator(request.payload, 'song');
        const songId = await this._songService.addSong(request.payload);
        return h.response({
            status: 'success',
            data: { songId },
        }).code(201);
    }

    async getSongs(request, h) {
        const songs = await this._songService.getSongs(request.query);
        return h.response({
            status: 'success',
            data: { songs },
        }).code(200);
    }

    async getSongById(request, h) {
        const song = await this._songService.getSongById(request.params);
        return h.response({
            status: 'success',
            data: { song },
        }).code(200);
    }

    async updateSongById(request, h) {
        this._validator(request.payload, 'song');
        await this._songService.updateSongById(request.params, request.payload);
        return h.response({
            status: 'success',
            message: 'Lagu berhasil di updated',
        }).code(200);
    }

    async deleteSongById(request, h) {
        await this._songService.deleteSongByID(request.params);
        return h.response({
            status: 'success',
            message: 'Lagu berhasil di delete',
        }).code(200);
    }
};


