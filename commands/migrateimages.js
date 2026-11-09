const { SlashCommandBuilder } = require('discord.js');
const {
	getDiscordImagesWithoutFilename,
	setImageFilename,
	updateImageUrl,
} = require('../models/images.js');
const { saveImage } = require('../imageStore.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getEmbedImageUrl = (message) => {
	for (const embed of message.embeds) {
		if (embed.image?.url) return embed.image.url;
		if (embed.thumbnail?.url) return embed.thumbnail.url;
	}
	return null;
};

// When a Discord CDN link is posted as message content, Discord re-links it and
// adds a fresh signed URL to the generated embed. Poll the message until it appears.
const waitForPreview = async (message, timeoutMs = 15000) => {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const fetched = await message.fetch();
		const url = getEmbedImageUrl(fetched);
		if (url) return url;
		await sleep(1000);
	}
	return null;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('migrateimages')
		.setDescription('Re-link dead Discord CDN images so they can be saved locally.')
		.addIntegerOption((option) =>
			option
				.setName('limit')
				.setDescription('Max images to process this run. Defaults to all.')
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('Channel to post images in. Defaults to this channel.')
		),
	async execute(interaction) {
		await interaction.deferReply();

		const safeEdit = async (content) => {
			try {
				await interaction.editReply(content);
			}
			catch {
				// The interaction token may expire during long migrations; keep going.
			}
		};

		const channel = interaction.options.getChannel('channel') ?? interaction.channel;
		if (!channel || typeof channel.send !== 'function') {
			await safeEdit('Please pick a text channel.');
			return;
		}

		const limit = interaction.options.getInteger('limit') ?? undefined;
		const images = await getDiscordImagesWithoutFilename(limit);

		if (images.length === 0) {
			await safeEdit('No dead Discord CDN images left to migrate.');
			return;
		}

		let saved = 0;
		let refreshed = 0;
		let failed = 0;
		const failures = [];

		for (let i = 0; i < images.length; i++) {
			const image = images[i];
			let helper;
			try {
				helper = await channel.send({ content: image.url, allowedMentions: { parse: [] } });
				const freshUrl = await waitForPreview(helper);

				if (!freshUrl) {
					failed += 1;
					failures.push(`${image.id} (no preview)`);
				}
				else {
					refreshed += 1;
					try {
						const filename = await saveImage(freshUrl);
						await setImageFilename(image.id, filename);
						saved += 1;

						try {
							await updateImageUrl(image.id, freshUrl);
						}
						catch {
							// Link update is best-effort; the local copy is what matters.
						}
					}
					catch (error) {
						failed += 1;
						failures.push(`${image.id} (${error.message})`);
					}
				}
			}
			catch (error) {
				failed += 1;
				failures.push(`${image.id} (${error.message})`);
			}
			finally {
				if (helper) {
					try {
						await helper.delete();
					}
					catch {
						// Ignore cleanup errors (e.g. missing MANAGE_MESSAGES permission).
					}
				}
			}

			if ((i + 1) % 10 === 0 || i === images.length - 1) {
				await safeEdit(
					`Migrating… ${i + 1}/${images.length} — ${saved} saved, ${refreshed} refreshed, ${failed} failed`,
				);
			}

			await sleep(750);
		}

		let summary = `Done — ${saved}/${images.length} saved locally, ${refreshed} links refreshed, ${failed} failed.`;
		if (failures.length > 0) {
			summary += `\nFailures: ${failures.slice(0, 25).join(', ')}${failures.length > 25 ? '…' : ''}`;
		}
		await safeEdit(summary);
	},
};
