const { MessageFlags } = require('discord.js');
const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const localCommands = getLocalCommands();

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

    if (interaction.isAutocomplete()) {
        const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);
        if (commandObject?.autocomplete) {
            try {
                return await commandObject.autocomplete(client, interaction);
            } catch (e) { if (e.code !== 10062) console.error(e); }
        }
        return;
    }

    // 3. Command finden
    const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);
    if (!commandObject) return;

    try {
        if (commandObject.devOnly && !devs.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Dev only.', flags: [MessageFlags.Ephemeral] });
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.error(`Fehler beim Ausführen von ${interaction.commandName}:`, error);
    }
};