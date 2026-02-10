const Discord = require('discord.js');
const {REST, Routes }= require('discord.js');
const {IntentsBitField, Client} = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const sleep = require('sleep-promise');
const eventHandler = require('./src/handlers/eventHandler');
const mongoose = require('mongoose');


require('dotenv').config();


const token = process.env.Discord_Bot_Token;

const client = new Client({ intents: 53608447});

const clientId = process.env.CLIENT_ID;

eventHandler(client);

// Run this once to nuke all Global Commands//
const rest = new REST({ version: '10' }).setToken(token);

// For Global Commands (commands that appear in every server)
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all global application commands.'))
	.catch(console.error);


mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Connected to MongoDB')

        client.login(process.env.Discord_Bot_Token);
})
