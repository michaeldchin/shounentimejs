const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getTopPeople } = require('../models/people.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shounentop')
		.setDescription('Shows most frequent users of shounen bot'),
	async execute(interaction) {
		const leaderboard = await getTopPeople();
		const leaderboardString = leaderboard.map((p, index) => {
			return `${index + 1}. **${p.name}** - ${p.count}`;
		}).join('\n');
		const embed = new EmbedBuilder()
			.setColor(0x770077)
			.setTitle(':trophy: Shounen Time Leaderboard')
			.setThumbnail('https://cdn.discordapp.com/emojis/576627772949266435.png')
			.setDescription(leaderboardString);
		await interaction.reply({ embeds: [ embed ] });
	},
};