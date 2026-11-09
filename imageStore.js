'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { frontendHost } = require('./config.json');

const IMAGES_DIR = path.join(__dirname, 'images');
const MAX_BYTES = 10 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 20000;

const EXTENSIONS = {
	'image/jpeg': '.jpg',
	'image/jpg': '.jpg',
	'image/png': '.png',
	'image/gif': '.gif',
	'image/webp': '.webp',
};

const getImagePath = (filename) => path.join(IMAGES_DIR, filename);

const getImagePublicUrl = (filename) => new URL(`images/${filename}`, frontendHost).toString();

const imageFileExists = (filename) => Boolean(filename) && fs.existsSync(getImagePath(filename));

const saveImage = async (url) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

	let response;
	try {
		response = await fetch(url, { signal: controller.signal });
	}
	catch (error) {
		throw new Error(`could not download image (${error.name === 'AbortError' ? 'timed out' : error.message})`);
	}
	finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		throw new Error(`could not download image (HTTP ${response.status})`);
	}

	const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
	const extension = EXTENSIONS[contentType];
	if (!extension) {
		throw new Error(`unsupported image type (${contentType || 'unknown'})`);
	}

	const contentLength = Number(response.headers.get('content-length'));
	if (contentLength > MAX_BYTES) {
		throw new Error('image too large (max 10MB)');
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.length === 0) {
		throw new Error('downloaded file is empty');
	}
	if (buffer.length > MAX_BYTES) {
		throw new Error('image too large (max 10MB)');
	}

	fs.mkdirSync(IMAGES_DIR, { recursive: true });
	const filename = `${crypto.randomUUID()}${extension}`;
	fs.writeFileSync(getImagePath(filename), buffer);

	return filename;
};

module.exports = {
	getImagePath,
	getImagePublicUrl,
	imageFileExists,
	saveImage,
};
