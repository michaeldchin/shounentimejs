const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addReminder } = require('../models/reminders.js');
const chrono = require('chrono-node');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addreminder')
		.setDescription('Add reminder for shounenbot to ping you at a later date.')
		.addStringOption(option => {
			return option.setName('reminder')
				.setDescription('Quote containing wisdom or humor. Quotation marks will be added automatically.')
				.setRequired(true);
		})
		.addStringOption(option => {
			return option.setName('remindertime')
				.setDescription('time when you want to be reminder')
                .setRequired(true);
		}),
	async execute(interaction) {
		const reminder = interaction.options.getString('reminder');
		const remindertime = chrono.parseDate(interaction.options.getString('remindertime'));
        let response
        if (remindertime === null) {
            response = `Invalid reminder time could not be parsed: ${reminder}`
        }
        else if (remindertime < Date.now()) {
            response = `Invalid reminder time is in the past: ${remindertime}`
        }
        else {
            await addReminder(reminder, 
                interaction.channelId, 
                remindertime,
                interaction.user.id,
                interaction.guildId);
		    response = `Set a reminder to "${reminder}" at ${remindertime}`;
        }

		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};