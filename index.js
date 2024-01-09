const Discord = require('discord.js');
const {IntentsBitField, Client} = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const sleep = require('sleep-promise');
const eventHandler = require('./src/handlers/eventHandler');
const mongoose = require('mongoose');


require('dotenv').config();




const client = new Client({ intents: 3276799});


eventHandler(client);




mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log('Connected to MongoDB')

        client.login(process.env.Discord_Bot_Token);
})
