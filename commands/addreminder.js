const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addReminder } = require('../models/reminders.js');

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
				.setDescription('time when you want to be reminder');
		}),
	async execute(interaction) {
		const reminder = interaction.options.getString('reminder');
        // Do some fancy string to date stuff
		const remindertime = interaction.options.getString('remindertime'); 

		const result = await addReminder(reminder, interaction.channelId, Date.now(),
            interaction.user.id,interaction.guildId);

		const response = `reminder added! ${JSON.stringify(result, null, 2)}`;
		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};