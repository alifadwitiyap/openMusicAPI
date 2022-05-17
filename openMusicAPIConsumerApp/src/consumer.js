const amqp = require('amqplib');
const playlistsService = require('./playlistsService');
const mailSender = require('./mailSender');
const listener = require('./listener');

require('dotenv').config();

const init = async () => {
	const playlists_service = new playlistsService();
	const mail_sender = new mailSender();
	const listener_service = new listener(playlists_service, mail_sender);

	const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
	const channel = await connection.createChannel();

	await channel.assertQueue('export:playlists', {
		durable: true,
	});

	console.log('Consumer App Listening ....');
	channel.consume('export:playlists', listener_service.listen, { noAck: true });
};

init();