const ClientError = require('../../exception/ClientError');

class songHandler{
    constructor(albumService) {
        this._albumService = albumService
    }

    async postAlbumHandler(request, h) {
        try {
            const albumId = await this._albumService.addAlbum(request.payload)
            return  h.response({
                status: 'success',
                data: {albumId}
            }).code(201)
        }catch (error){
            if (error instanceof ClientError){
                return h.response({
                    status:'fail',
                    message: error.message
                }).code(error.statusCode)
            }

            return h.response({
                status:'error',
                message:"Maaf, terjadi kegagalan pada server kami"
            }).code(500)
        }
    }

}
