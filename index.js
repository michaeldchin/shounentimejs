'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', p => {
	console.log('Ready!', p.application);
});


client.login(token);