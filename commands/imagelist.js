const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { frontendHost } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('imagelist')
		.setDescription('Link to list of images & IDs'),
	async execute(interaction) {
		const url = new URL('/images?server=' + interaction.guildId, frontendHost)
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription(`Go to ${url} for a list of server specific images`);
		await interaction.reply({ embeds: [ embed ] });
	},
};