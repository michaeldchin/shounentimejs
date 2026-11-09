const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addImage } = require('../models/images.js');
const { saveImage } = require('../imageStore.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addimage')
		.setDescription('Add linked image to database.')
		.addStringOption(option => {
			return option.setName('url')
				.setDescription('Link to image (png,jpg,jpeg,webp,gif)')
				.setRequired(true);
		})
		.addStringOption(option => {
			return option.setName('tag')
				.setDescription('Name/tag to describe the picture');
		})
		.addBooleanOption(option => {
			return option.setName('global')
				.setDescription('Server only or public to all servers. Defaults to server only');
		}),
	async execute(interaction) {
		const url = interaction.options.getString('url');
		const tag = interaction.options.getString('tag');
		const globalFlag = interaction.options.getBoolean('global');
		const guildId = globalFlag ? null : interaction.guildId;

		if (!url.startsWith('https://')) {
			await interaction.reply({ content: 'Invalid url. Make sure it is an https link to an image.', ephemeral: true });
			return;
		}

		let filename;
		try {
			filename = await saveImage(url);
		}
		catch (error) {
			await interaction.reply({ content: `Couldn't save image: ${error.message}`, ephemeral: true });
			return;
		}

		const result = await addImage(url, tag, guildId, interaction.user.id, filename);

		const response = `image added and saved locally! ${JSON.stringify(result, null, 2)}`;
		const embed = new EmbedBuilder().setColor(0x007777)
			.setDescription(response);

		await interaction.reply({ embeds: [ embed ] });
	},
};
