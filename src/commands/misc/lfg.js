const lfgHandler = require('../../utils/handleButtons'); // Pfad prüfen!
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'lfg',
    description: 'Erstelle eine Suche für GTA V Mitspieler.',
    options: [
        { 
            name: 'heist', 
            description: 'Welcher Heist oder welcher Akt?', 
            type: ApplicationCommandOptionType.String, 
            required: true 
        },
        { 
            name: 'players', 
            description: 'Wie viele Spieler werden insgesamt noch gesucht?', 
            type: ApplicationCommandOptionType.Integer, // Integer für reine Zahlen
            required: true,
            min_value: 1,
            max_value: 3
        },
        { 
            name: 'mic', 
            description: 'Ist ein Mikrofon erforderlich?', 
            type: ApplicationCommandOptionType.String, 
            required: true,
            choices: [
                { name: 'Ja', value: 'Ja' }, 
                { name: 'Nein', value: 'Nein' }, 
                { name: 'Egal / Optional', value: 'Egal' }
            ]
        },
    ],

    callback: async (client, interaction) => {
        const heist = interaction.options.getString('heist');
        const players = interaction.options.getInteger('players');
        const mic = interaction.options.getString('mic');

        // Wir übergeben jetzt auch "players" an den Handler
        await lfgHandler(interaction, heist, mic, players);
    }
};