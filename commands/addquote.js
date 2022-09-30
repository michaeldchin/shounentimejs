const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addQuote } = require('../models/quotes.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addquote')
		.setDescription('Add quote to database.')
		.addStringOption(option => {
			return option.setName('quote')
				.setDescription('Quote containing wisdom or humor. Quotation marks will be added automatically.')
				.setRequired(true);
		})
		.addStringOption(option => {
			return option.setName('author')
				.setDescription('Optional: author of quote');
		}),
	async execute(interaction) {
		const quote = interaction.options.getString('quote');
		const author = interaction.options.getString('author');

		const result = await addQuote(quote, author, interaction.guildId, interaction.user.id);

		const response = `quote added! ${JSON.stringify(result)}`;
		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};