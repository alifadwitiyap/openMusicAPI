class ExportsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postLikesHandler = this.postLikesHandler.bind(this);
		this.getLikesCountHandler = this.getLikesCountHandler.bind(this);
	}

	async postLikesHandler(request, h) {
		await this._service.isAlbumExist(request.params.id);
		const message = await this._service.likeAlbum(request.params.id, request.auth.credentials.id);

		const response = h.response({
			status: "success",
			message
		});
		response.code(201);
		return response;
	}
	async getLikesCountHandler(request, h) {
		await this._service.isAlbumExist(request.params.id);
		const data = await this._service.countLike(request.params.id);

		const response = h.response({
			status: "success",
			data: { likes: parseInt(data.count) }
		});
		response.header("X-Data-Source", data.source);
		response.code(200);
		return response;
	}
}

module.exports = ExportsHandler;
