

## Deployment
git clone/pull this repo
npm install
Fill out config.json.example as `config.json` in root folder
`npm start`

Application commands are registered automatically on startup, so there is no separate
deploy step. Add or remove files in `commands/` and restart the bot.

shounentime and shounen-backend are system.d jobs
shounen-frontend is configured using nginx pointing to it

## Images

`/addimage` downloads the image and saves a local copy in `images/` (gitignored).
Embeds and the frontend use the local copy, so images keep working if the original
link goes down. The images folder is served by nginx and needs this location in the
shounenbot.micool.dev server block:

	location /images/ {
		alias /home/debian/src/shounentimejs/images/;
		add_header Cache-Control "public, max-age=31536000, immutable";
	}

Pre-existing images (added before local storage) can be backfilled once with:
`node scripts/backfill-images.js`