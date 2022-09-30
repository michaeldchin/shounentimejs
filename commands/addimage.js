const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addImage } = require('../models/images.js');
const path = require('path');

const urlIsValid = (url) => {
	if (!url.startsWith('https://')) return false;

	const ending = path.extname(url).toLowerCase();
	const validExtensions = [
		'.jpg',
		'.jpeg',
		'.png',
		'.webp',
		'.gif',
	];
	if (ending && validExtensions.includes(ending)) {
		return true;
	}
	return false;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addimage')
		.setDescription('Add linked image to database.')
		.addStringOption(option => {
			return option.setName('url')
				.setDescription('Link to image (png,jpg,jpeg,webp)')
				.setRequired(true);
		})
		.addStringOption(option => {
			return option.setName('tag')
				.setDescription('Name/tag to describe the picture');
		}),
	async execute(interaction) {
		const url = interaction.options.getString('url');
		const tag = interaction.options.getString('tag');

		if (!urlIsValid(url)) {
			const errorReply = 'Invalid url. Make sure it is a link that ends with (png,jpg,jpeg,webp)';
			await interaction.reply({ content: errorReply, ephemeral: true });
			return;
		}
		const result = await addImage(url, tag, interaction.guildId, interaction.user.id);

		const response = `image added! ${JSON.stringify(result, null, 2)}`;
		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};