const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addPodcastTopic } = require('../models/podcasttopic.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpodcasttopic')
		.setDescription('Add podcast topic to database.')
		.addStringOption(option => {
			return option.setName('topic')
				.setDescription('Topic to add to podcast topic list.')
				.setRequired(true);
		})
		.addBooleanOption(option => {
			return option.setName('global')
				.setDescription('Server only or public to all servers. Defaults to server only');
		}),
	async execute(interaction) {
		const topic = interaction.options.getString('topic');
		const globalFlag = interaction.options.getBoolean('global');
		const guildId = globalFlag ? null : interaction.guildId;

		const result = await addPodcastTopic(topic, guildId, interaction.user.id);

		const response = `podcast topic added! ${JSON.stringify(result, null, 2)}`;
		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};
