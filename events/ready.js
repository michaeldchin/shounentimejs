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

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('' + new Date());

		// Polls DB for reminders
		setInterval(() => triggerReminders(client), 5000);
	},
};