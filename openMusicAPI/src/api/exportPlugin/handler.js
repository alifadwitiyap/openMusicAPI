class ExportsHandler {
	constructor(service, playlistsService, validator) {
		this._service = service;
		this._validator = validator;
		this._playlistService = playlistsService;

		this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
	}

	async postExportPlaylistHandler(request, h) {
		this._validator(request.payload, "export");
		await this._service.isPlaylistExist(request.params.playlistId);
		await this._playlistService.verifyPlaylistAccess(
			{ id: request.params.playlistId },
			request.auth.credentials
		);

		const message = {
			playlistId: request.params.playlistId,
			targetEmail: request.payload.targetEmail
		};

		await this._service.sendMessage("export:playlists", JSON.stringify(message));

		const response = h.response({
			status: "success",
			message: "Permintaan Anda sedang kami proses"
		});
		response.code(201);
		return response;
	}
}

module.exports = ExportsHandler;
