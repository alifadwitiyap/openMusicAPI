class UploadsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postUploadAlbumCover = this.postUploadAlbumCover.bind(this);
	}

	async postUploadAlbumCover(request, h) {
		const { cover } = request.payload;

		this._validator(cover.hapi.headers, "upload");

		await this._service.upload(cover, cover.hapi, request.params.id);

		const response = h
			.response({
				status: "success",
				message: "Sampul berhasil diunggah"
			})
			.code(201);
		return response;
	}
}

module.exports = UploadsHandler;
