module.exports =
    class collaborationHandler {
        constructor(service, validator, playlistService) {
            this._service = service;
            this._validator = validator;
            this._playlistService = playlistService;

            this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
            this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)

        }


        async postCollaborationHandler(request, h) {
            await this._playlistService.verifyPlaylistAccess({ id: request.payload.playlistId }, request.auth.credentials);
            await this._service.checkTargetCollab(request.payload)
            const collaborationId = await this._service.addCollaboration(request.payload)

            return h.response({
                status: 'success',
                data: {
                    collaborationId,
                },
            }).code(201);
        }



        async deleteCollaborationHandler(request, h) {
            await this._playlistService.verifyPlaylistOwner({ id: request.payload.playlistId }, request.auth.credentials);
            await this._service.deleteCollaboration(request.payload)

            return h.response({
                status: 'success',
                message: 'Collaboration berhasil dihapus'
            }).code(200);
        }

        async verifyCollaborator(noteId, userId) {
            const query = {
                text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
                values: [ noteId, userId ],
            };

            const result = await this._pool.query(query);

            if (!result.rows.length) {
                throw new InvariantError('Kolaborasi gagal diverifikasi');
            }
        }



    }