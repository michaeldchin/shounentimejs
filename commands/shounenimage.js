const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomImage } = require('../models/images.js');
const { getRandomQuote } = require('../models/quotes.js');

const _formatQuote = (quote, author) => {
	return `« ${quote} » ${author}`;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shounenimage')
		.setDescription('the best command'),
	async execute(interaction) {
		const quote = await getRandomQuote();
		const image = await getRandomImage();

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