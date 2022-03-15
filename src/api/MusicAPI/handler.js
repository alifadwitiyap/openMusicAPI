const catchError = require('../../util/catchError')

class Handler {

    constructor(albumService) {
        this._albumService = albumService
        this.postAlbumHandler = this.postAlbumHandler.bind(this)
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
    }

    async postAlbumHandler(request, h) {
        try {
            const albumId = await this._albumService.addAlbum(request.payload)
            return h.response({
                status: 'success',
                data: { albumId }
            }).code(201)

        } catch (error) {
            return catchError(error, h)
        }
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const album = await this._albumService.getAlbumByID(request.params)
            return h.response({
                status: 'success',
                data: { album }
            }).code(200)
        } catch (error) {
            return catchError(error, h)
        }
    }

    async putAlbumByIdHandler(request, h) {
        try {
            await this._albumService.updateAlbumByID(request.params, request.payload)
            return h.response({
                status: 'success',
                message: 'Data Berhasil di Update'
            }).code(200)
        } catch (error) {
            return catchError(error, h)
        }
    }

    async deleteAlbumByIdHandler(request, h) {
        try {
            await this._albumService.deleteAlbumByID(request.params, request.payload)
            return h.response({
                status: 'success',
                message: 'Data Berhasil di Hapus'
            }).code(200)
        } catch (error) {
            return catchError(error, h)
        }
    }


}

module.exports = Handler
