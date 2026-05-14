const { MessageFlags } = require('discord.js');
const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    //try {
      //  await interaction.deferReply(); 
    //} catch (err) {
      //  console.error("Fehler beim globalen Defer:", err);
        //return;
    //}

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only developers are allowed to run this command.',
                    flags: [MessageFlags.Ephemeral],
                });
                return;
            }
        }

        if (commandObject.testOnly) {
            if (!interaction.guild.id === testServer) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    flags: [MessageFlags.Ephemeral],
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions.',
                        flags: [MessageFlags.Ephemeral],
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        flags: [MessageFlags.Ephemeral],
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(error)
        console.log(`There was an error running this command: ${error}`);
    }

    if (interaction.isAutocomplete()) {
    // 1. Debug: Welcher Command wird angefragt?
    console.log(`Autocomplete-Anfrage für: ${interaction.commandName}`);

    // 2. Commands laden (hier musst du den Pfad zu deinem Command-Reader anpassen!)
    const getLocalCommands = require('../../utils/getLocalCommands'); // Pfad prüfen!
    const localCommands = getLocalCommands();

    const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) {
        console.log(`Kein Command-Objekt für ${interaction.commandName} gefunden.`);
        return;
    }

    if (!commandObject.autocomplete) {
        console.log(`Der Command ${interaction.commandName} hat keine autocomplete-Funktion.`);
        return;
    }

    try {
        console.log(`Führe Autocomplete für ${interaction.commandName} aus...`);
        await commandObject.autocomplete(client, interaction);
    } catch (error) {
        console.error(`Fehler beim Ausführen von Autocomplete:`, error);
    }
}
};