const { MessageFlags } = require('discord.js');
const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const localCommands = getLocalCommands();

module.exports = async (client, interaction) => {
    // 1. Sofort-Ausstieg für alles, was kein Command/Autocomplete ist
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

    // 2. Autocomplete extrem schnell abhandeln
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

    // 4. PRE-CHECKS (Nur das Nötigste vor dem Callback)
    try {
        // Dev Check ist schnell (nur Array-Abgleich)
        if (commandObject.devOnly && !devs.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Dev only.', flags: [MessageFlags.Ephemeral] });
        }

        // --- JETZT DER CALLBACK ---
        // Wir springen SOFORT in den Command. 
        // Die Permission-Checks machen wir IN den Commands oder wir riskieren hier den Timeout.
        await commandObject.callback(client, interaction);

    } catch (error) {
        console.error(`Fehler beim Ausführen von ${interaction.commandName}:`, error);
    }
};