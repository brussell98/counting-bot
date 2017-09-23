const config = require('./config.json'),
	Eris = require('eris'),
	bot = new Eris(config.token, {
		messageLimit: 0
	}),
	CountingChannelManager = require('./CountingChannelManager');

let countingChannels = new Map();

bot.on('ready', () => console.info('Counting bot connected'));
bot.on('disconnected', () => console.warn('Counting bot disconnected'));

bot.once('ready', () => {
	return bot.guilds.forEach(g => {
		return g.channels.filter(c => c.name.startsWith('counting')).forEach(c => {
			let manager = new CountingChannelManager(c);
			manager.init();
			return countingChannels.set(c.id, manager);
		});
	});
});

bot.on('channelCreate', channel => {
	if (channel.name.startsWith('counting')) {
		let manager = new CountingChannelManager(channel);
		manager.init();
		return countingChannels.set(channel.id, manager);
	}
});

bot.on('messageCreate', message => {
	if (countingChannels.has(message.channel.id))
		return countingChannels.get(message.channel.id).handleNewMessage(message);
});

bot.connect();
