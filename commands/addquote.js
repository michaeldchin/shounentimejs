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
		})
		.addBooleanOption(option => {
			return option.setName('global')
				.setDescription('Server only or public to all servers. Defaults to server only');
		}),
	async execute(interaction) {
		const quote = interaction.options.getString('quote');
		const author = interaction.options.getString('author');
		const globalFlag = interaction.options.getBoolean('global');
		const guildId = globalFlag ? null : interaction.guildId;

		const result = await addQuote(quote, author, guildId, interaction.user.id);

		const response = `quote added! ${JSON.stringify(result, null, 2)}`;
		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};