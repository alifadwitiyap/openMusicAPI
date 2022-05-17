const fs = require("fs");
const { Pool } = require("pg");

class StorageService {
	constructor(folder) {
		this._db = new Pool();
		this._folder = folder;

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}
	}

	_writeFile(file, meta) {
		const filename = +new Date() + meta.filename;
		const path = `${this._folder}/${filename}`;

		const fileStream = fs.createWriteStream(path);

		return new Promise((resolve, reject) => {
			fileStream.on("error", error => reject(error));
			file.pipe(fileStream);
			file.on("end", () => resolve(filename));
		});
	}

	async upload(file, meta, id) {
		const filename = await this._writeFile(file, meta);
		const coverPath = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
		const query = {
			text: "UPDATE albums SET cover=$1 WHERE id=$2 RETURNING id",
			values: [coverPath, id]
		};
		const result = await this._db.query(query);
		if (result.rows.length < 1) {
			throw new responseError("Album tidak ditemukan", 404);
		}
	}
}

module.exports = StorageService;
