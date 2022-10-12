const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getQuoteById, getRandomQuote, getRandomServerQuote } = require('../models/quotes.js');
const { getImageById, getRandomImage, getRandomServerImage } = require('../models/images.js');

const _formatQuote = (quote, author) => {
	return `« ${quote} » ${author ? author : ''}`;
};

const _getQuote = async (quoteId, guildId) => {
	if (quoteId === 'custom') {
		return await getRandomServerQuote(guildId);
	}
	else if (quoteId) {
		return await getQuoteById(quoteId);
	}
	else if (!quoteId) {
		return await getRandomQuote(guildId);
	}
	throw new Error('Unexpected input: ', quoteId, guildId);
};

const _getImage = async (imageId, guildId) => {
	if (imageId === 'custom') {
		return await getRandomServerImage(guildId);
	}
	else if (imageId) {
		return await getImageById(imageId);
	}
	else if (!imageId) {
		return await getRandomImage(guildId);
	}
	throw new Error('Unexpected input: ', imageId, guildId);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shounenimage')
		.setDescription('the best command')
		.addStringOption(option => {
			return option.setName('quoteid')
				.setDescription('quoteId or "custom" for server specific quotes');
		})
		.addStringOption(option => {
			return option.setName('imageid')
				.setDescription('imageId or "custom" for server specific images');
		}),
	async execute(interaction) {
		const quote = await _getQuote(interaction.options.getString('quoteid'), interaction.guildId);
		const image = await _getImage(interaction.options.getString('imageid'), interaction.guildId);

		const embed = new EmbedBuilder().setColor(0x777777);

		if (quote) {
			embed.setDescription(_formatQuote(quote.quote, quote.author));
		}
		else {
			embed.setDescription('Invalid quote: ' + quote);
		}

		if (image) {
			embed.setImage(image.url);
		}
		else {
			embed.setImage('https://i.kym-cdn.com/photos/images/original/002/113/379/aee.jpeg');
		}

		await interaction.reply({ embeds: [ embed ] });
	},
};