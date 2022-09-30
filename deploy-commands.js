const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const path = require('path');
const fs = require('fs');

const rest = new REST({ version: '10' }).setToken(token);


const setUpCommands = () => {
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    return commandFiles
        .map(filePath => require('./commands/' + filePath).data)
        .map(command => command.toJSON());
};

rest.put(Routes.applicationCommands(clientId), { body: setUpCommands() })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

// delete one command
// const commandId = '';
// rest.delete(Routes.applicationCommand(clientId, commandId))
//     .then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);

// delete all global commands
// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);