const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { frontendHost } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotelist')
		.setDescription('Link to list of quotes & IDs'),
	async execute(interaction) {
		const url = new URL('/quotes', frontendHost)
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription(`Go to ${url} for a full list of quotes`);
		await interaction.reply({ embeds: [ embed ] });
	},
};