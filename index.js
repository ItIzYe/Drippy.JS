console.log('[1] Starting script...');

const { Events ,Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const eventHandler = require('./src/handlers/eventHandler');
require('dotenv').config();

console.log('[2] Libraries loaded.');

// Konfiguration & Umgebungsvariablen
const token = process.env.Discord_Bot_Token;
const mongoURL = process.env.MONGODB_URL;
const clientId = process.env.CLIENT_ID;
const isProd = process.env.APP_ENV === 'prod';
const forceRegister = process.argv.includes('--reg');

console.log(`[3] Mongo URL Status: ${mongoURL ? 'FOUND' : 'UNDEFINED (missing from .env)'}`);

// Client Initialisierung mit expliziten Intents (Sauberer als die Bit-Zahl)
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

// --- EVENT HANDLER LADEN ---
console.log('[4] Loading Handlers...');
eventHandler(client);

// --- MONGOOSE CONNECTION ---
console.log('[5] Attempting Mongoose Connection...');
mongoose.connect(mongoURL || '', { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('[6] ✅ Mongoose Connected Successfully!');
    })
    .catch((err) => {
        console.log('[6] ❌ Mongoose Failed:', err.message);
    });

// --- READY EVENT & COMMAND REGISTRATION ---
client.once(Events.ClientReady, async (c) => {
    console.log(`[7] ✅ Bot Logged In as ${c.user.tag}!`);

    // Registrierung nur in Prod oder bei manuellem --reg Flag
    if (isProd || forceRegister) {
        console.log('[8] 🔄 Synchronizing Commands with Discord (Prod/Force mode)...');
        try {
            const registerCommands = require('./src/handlers/registerCommands');
            await registerCommands(c);
            console.log('[9] ✅ Command Synchronization Complete.');
        } catch (error) {
            console.error('[9] ❌ Command Synchronization Failed:', error);
        }
    } else {
        console.log('[8] ⏩ Skipping Command Registration (Dev mode). Use --reg to force update.');
    }
});

// --- GLOBAL INTERACTION LOGGER (DEBUG) ---
/* client.on('interactionCreate', (interaction) => {
    console.time(`Command-Timer-${interaction.id}`);
    if (interaction.isChatInputCommand()) {
        console.log(`[CMD] ${interaction.user.tag} nutzt /${interaction.commandName}`);
    }
    if (interaction.isModalSubmit()) {
        console.log(`[MODAL] ${interaction.user.tag} hat Modal gesendet: ${interaction.customId}`);
    }
    if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
        const handleCommands = require('./src/events/interactionCreate/handleCommands'); // Pfad ggf. anpassen
        handleCommands(client, interaction);
    }
}); */

// --- BOT LOGIN ---
console.log('[10] Logging into Bot...');
client.login(token).catch(err => {
    console.error('❌ Bot Login Failed:', err);
});