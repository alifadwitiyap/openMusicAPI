
module.exports = class albumHandler {
    constructor(albumService, validator) {
        this._albumService = albumService
        this._validator = validator

        this.postAlbumHandler = this.postAlbumHandler.bind(this)
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
    }

    async postAlbumHandler(request, h) {
        this._validator(request.payload, 'album')
        const albumId = await this._albumService.addAlbum(request.payload)
        return h.response({
            status: 'success',
            data: { albumId }
        }).code(201)
    }

    async getAlbumByIdHandler(request, h) {
        const album = await this._albumService.getAlbumByID(request.params)
        album.songs = await this._albumService.getSongsByAlbumId(album)
        return h.response({
            status: 'success',
            data: { album }
        }).code(200)
    }

    async putAlbumByIdHandler(request, h) {
        this._validator(request.payload, 'album')
        await this._albumService.updateAlbumByID(request.params, request.payload)
        return h.response({
            status: 'success',
            message: 'Data Berhasil di Update'
        }).code(200)
    }

    async deleteAlbumByIdHandler(request, h) {
        await this._albumService.deleteAlbumByID(request.params)
        return h.response({
            status: 'success',
            message: 'Data Berhasil di Hapus'
        }).code(200)
    }
}
