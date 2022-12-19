const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { host } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotelist')
		.setDescription('Link to list of quotes & IDs'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription(`Go to ${host}/quotes for a full list of quotes`);
		await interaction.reply({ embeds: [ embed ] });
	},
};