const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPodcastTopicById, getRandomPodcastTopic, getRandomServerPodcastTopic } = require('../models/podcasttopic.js');

const _formatTopic = (topic) => {
	return topic;
};

const _getPodcastTopic = async (topicId, guildId) => {
	if (topicId === 'custom') {
		return await getRandomServerPodcastTopic(guildId);
	}
	else if (topicId) {
		return await getPodcastTopicById(topicId);
	}
	else if (!topicId) {
		return await getRandomPodcastTopic(guildId);
	}
	throw new Error('Unexpected input: ', topicId, guildId);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shounentopic')
		.setDescription('give me something to talk about')
		.addStringOption(option => {
			return option.setName('topicid')
				.setDescription('topicId or "custom" for server specific podcast topics');
		}),
	async execute(interaction) {
		const topic = await _getPodcastTopic(interaction.options.getString('topicId'), interaction.guildId);

		const embed = new EmbedBuilder().setColor(0x777777);

		if (topic) {
			embed.setDescription(_formatTopic(topic.topic));
		}
		else {
			embed.setDescription('Invalid topic: ' + topic);
		}

		await interaction.reply({ embeds: [ embed ] });
	},
};
