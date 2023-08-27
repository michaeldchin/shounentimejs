const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { listReminders } = require('../models/reminders.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listreminders')
		.setDescription('Lists out your reminders.'),
	async execute(interaction) {
		const result = await listReminders(interaction.user.id, Date.now());
		
		const response = result.length > 0
			? result.map(s => `${s.reminderDate}: ${s.reminder}`).join('\n') 
			: 'No upcoming reminders.';
		console.log(response)
		const embed = new EmbedBuilder().setColor(0x007777)
			.setTitle('Your upcoming reminders')
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};