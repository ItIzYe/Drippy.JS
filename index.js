const Discord = require('discord.js');
const {Intents, Client} = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const sleep = require('sleep-promise');
const eventHandler = require('./src/handlers/eventHandler');
const mongoose = require('mongoose');


require('dotenv').config();




const client = new Client({ intents: [
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES]});


eventHandler(client);




mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Connected to MongoDB')

        client.login(process.env.Discord_Bot_Token);
})
