console.log('[1] Startin script...');
const Discord = require('discord.js');
const {REST, Routes }= require('discord.js');
const {IntentsBitField, Client} = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const sleep = require('sleep-promise');
const eventHandler = require('./src/handlers/eventHandler');
const mongoose = require('mongoose');


require('dotenv').config();

console.log('[2] Libraries loaded.');

const token = process.env.Discord_Bot_Token;
const mongoURL = process.env.MONGODB_URL;
console.log(`[3] Mongo URL Status: ${mongoURL ? 'FOUND': 'UNDEFINED (missing from .env)'}`); 

const client = new Client({ intents: 53608447});

const clientId = process.env.CLIENT_ID;


const rest = new REST({ version: '10' }).setToken(token);


//client.rest.on('rateLimited', (info) => {
//    console.log(`⚠️ RATE LIMIT HIT!`);
//    console.log(`- Time to wait: ${info.timeToReset}ms`);
//    console.log(`- Global Limit? ${info.global ? 'YES' : 'No'}`);
//    console.log(`- Route: ${info.route}`);
//});

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all global application commands.'))
	.catch(console.error);
console.log('[4] Loading Handlers...');
eventHandler(client);

console.log('[5] Attempting Mongoose Connection...');

mongoose.connect(mongoURL || '', { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('[6] ✅ Mongoose Connected Successfully!');
    })
    .catch((err) => {
        console.log('[6] ❌ Mongoose Failed:', err.message);
    });
console.log('[7] Logging into Bot...');
client.login(process.env.Discord_Bot_Token)
    .then(() => console.log('✅ Bot Logged In!'))
    .catch(err => console.error('❌ Bot Login Failed:', err));
