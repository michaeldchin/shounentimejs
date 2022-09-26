const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shounentime')
		.setDescription('It\'s Shounen time!'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription('It\'s Shounen time!')
			.setImage('https://cdn.discordapp.com/attachments/572464049179328532/572639933139779594/Shounen_Time.png');
		await interaction.reply({ embeds: [ embed ] });
	},
};