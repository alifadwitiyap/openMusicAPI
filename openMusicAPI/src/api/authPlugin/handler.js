module.exports = class authHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postRegisterUser = this.postRegisterUser.bind(this);
		this.postLoginUser = this.postLoginUser.bind(this);
		this.putAccessToken = this.putAccessToken.bind(this);
		this.deleteLogoutUser = this.deleteLogoutUser.bind(this);
	}

	async postRegisterUser(request, h) {
		this._validator(request.payload, "register");
		const userId = await this._service.registerUser(request.payload);

		return h
			.response({
				status: "success",
				data: { userId }
			})
			.code(201);
	}

	async postLoginUser(request, h) {
		this._validator(request.payload, "login");
		const data = await this._service.loginUser(request.payload);

		return h
			.response({
				status: "success",
				data
			})
			.code(201);
	}

	async putAccessToken(request, h) {
		this._validator(request.payload, "token");
		const data = await this._service.updateAccessToken(request.payload);

		return h
			.response({
				status: "success",
				data
			})
			.code(200);
	}

	async deleteLogoutUser(request, h) {
		this._validator(request.payload, "token");
		await this._service.logoutUser(request.payload);

		return h
			.response({
				status: "success",
				message: "Logout telah berhasil dilakukan"
			})
			.code(200);
	}
};
