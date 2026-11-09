

## Deployment
git clone/pull this repo
npm install
Fill out config.json.example as `config.json` in root folder
`npm start`

Application commands are registered automatically on startup, so there is no separate
deploy step. Add or remove files in `commands/` and restart the bot.

shounentime and shounen-backend are system.d jobs
shounen-frontend is configured using nginx pointing to it