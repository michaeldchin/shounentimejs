const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPodcastTopicById, getRandomPodcastTopic, getRandomServerPodcastTopic } = require('../models/podcasttopic.js');

const _formatQuote = (quote, author) => {
	return `« ${quote} » ${author ? author : ''}`;
};

const _getQuote = async (quoteId, guildId) => {
	if (quoteId === 'custom') {
		return await getRandomServerPodcastTopic(guildId);
	}
	else if (quoteId) {
		return await getPodcastTopicById(quoteId);
	}
	else if (!quoteId) {
		return await getRandomPodcastTopic(guildId);
	}
	throw new Error('Unexpected input: ', quoteId, guildId);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shounentopic')
		.setDescription('give me something to talk about')
		.addStringOption(option => {
			return option.setName('topicId')
				.setDescription('topicId or "custom" for server specific podcast topics');
		})
		.addStringOption(option => {
			return option.setName('imageid')
				.setDescription('imageId or "custom" for server specific images');
		}),
	async execute(interaction) {
		const quote = await _getQuote(interaction.options.getString('quoteid'), interaction.guildId);

		const embed = new EmbedBuilder().setColor(0x777777);

		if (quote) {
			embed.setDescription(_formatQuote(quote.quote, quote.author));
		}
		else {
			embed.setDescription('Invalid quote: ' + quote);
		}

		await interaction.reply({ embeds: [ embed ] });
	},
};