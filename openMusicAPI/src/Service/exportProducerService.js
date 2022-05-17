const amqp = require("amqplib");
const { Pool } = require("pg");
const responseError = require("../exception/responseError");

class ProducerService {
	constructor() {
		this._db = new Pool();
	}

	async sendMessage(queue, message) {
		const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
		const channel = await connection.createChannel();
		await channel.assertQueue(queue, {
			durable: true
		});

		await channel.sendToQueue(queue, Buffer.from(message));

		setTimeout(() => {
			connection.close();
		}, 1000);
	}

	async isPlaylistExist(playlistId) {
		const query = {
			text: `SELECT * FROM playlists WHERE id = $1`,
			values: [playlistId]
		};
		const result = await this._db.query(query);

		if (!result.rows.length > 0) {
			throw new responseError("Playlists tidak ditemukan", 404);
		}
	}
}

module.exports = ProducerService;
