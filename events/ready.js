const { getDueReminders, setSentFlag } = require('../models/reminders.js');

const triggerReminders = async (client) => {
	const dueReminders = await getDueReminders();

	for (const reminder of dueReminders) {
		const channel = client.channels.cache.get(reminder.channelId);
		await channel.send({
			content: `<@${reminder.discordId}> ${reminder.reminder}`,
		});
		await setSentFlag(reminder.id);
	}
};

const registerCommands = async (client) => {
	const commandData = client.commands.map(command => command.data.toJSON());

	if (commandData.length === 0) {
		console.warn('No commands loaded, skipping command registration.');
		return;
	}

	try {
		await client.application.commands.set(commandData);
		console.log(`Registered ${commandData.length} application commands.`);
	}
	catch (error) {
		console.error('Failed to register application commands:', error);
	}
};

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		await registerCommands(client);

		client.user.setActivity('' + new Date());

		// Polls DB for reminders
		setInterval(() => triggerReminders(client), 5000);
	},
};