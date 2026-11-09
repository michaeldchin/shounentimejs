'use strict';

const { getImagesWithoutFilename, setImageFilename } = require('../models/images.js');
const { saveImage } = require('../imageStore.js');

const run = async () => {
	const images = await getImagesWithoutFilename();
	console.log(`${images.length} images without a local copy.`);

	let saved = 0;
	for (const image of images) {
		try {
			const filename = await saveImage(image.url);
			await setImageFilename(image.id, filename);
			saved += 1;
			console.log(`saved ${image.id}: ${filename}`);
		}
		catch (error) {
			console.log(`failed ${image.id}: ${error.message}`);
		}
	}

	console.log(`Done: ${saved}/${images.length} saved locally.`);
	process.exit(0);
};

run().catch((error) => {
	console.error(error);
	process.exit(1);
});
