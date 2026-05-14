const Appeal = require('../../models/Appeal');
const GuildConfiguration = require('../../models/GuildConfiguration');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder
} = require('discord.js');
const language = require("../../handlers/languages");

module.exports = {
    name: 'appeal',
    description: 'Fechte eine Bestrafung an (Nur in DMs nutzen!)',
    options: [
        {
            name: 'reason',
            description: 'Warum sollte die Bestrafung aufgehoben werden?',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'server-id',
            description: 'Wähle den Server aus.',
            type: ApplicationCommandOptionType.String,
            required: true, // Muss true sein, damit man absenden kann
            autocomplete: true,
        },
    ],

    /**
     * Diese Funktion wird von deinem handleCommands.js aufgerufen, 
     * wenn der User im Feld "server-id" tippt.
     */
    autocomplete: async (client, interaction) => {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        
        // Wir holen alle Guilds aus dem Cache
        const guilds = client.guilds.cache.map(guild => ({
            name: guild.name,
            value: guild.id
        }));

        // Filtern nach dem, was der User bereits getippt hat
        const filtered = guilds.filter(guild => 
            guild.name.toLowerCase().includes(focusedValue)
        ).slice(0, 25);

        try {
            await interaction.respond(filtered);
        } catch (error) {
            console.error(`Fehler beim Autocomplete in appeal.js: ${error}`);
        }
    },

    callback: async (client, interaction) => {
        // Prüfen, ob der Command in einer DM ausgeführt wurde
        if (interaction.guildId) {
            return interaction.reply({ 
                content: "Bitte nutze diesen Command direkt in meinen DMs!", 
                ephemeral: true 
            });
        }

        const guildId = interaction.options.get('server-id').value;
        const reason = interaction.options.get('reason').value;
        const user = interaction.user;

        // Config für diesen Server laden
        const config = await GuildConfiguration.findOne({ guildId: guildId });
        if (!config || !config.appealChannelIds?.length) {
            return interaction.reply("Dieser Server hat das Einspruch-System nicht konfiguriert.");
        }

        // Guild fetchen, falls nicht im Cache (wichtig in DMs!)
        const targetGuild = await client.guilds.fetch(guildId).catch(() => null);
        if (!targetGuild) return interaction.reply("Ich konnte den Server nicht finden.");

        const logChannel = targetGuild.channels.cache.get(config.appealChannelIds[0]);
        if (!logChannel) return interaction.reply("Support-Kanal nicht gefunden.");

        const caseId = Math.random().toString(36).substring(2, 8).toUpperCase();

        await Appeal.create({
            caseId: caseId,
            userId: user.id,
            userName: user.tag,
            guildId: guildId
        });

        const adminEmbed = new EmbedBuilder()
            .setTitle(`🆕 Neuer Einspruch | Case #${caseId}`)
            .setColor('Blue')
            .addFields(
                { name: 'User', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: 'Grund', value: reason }
            )
            .setTimestamp();

        await logChannel.send({ embeds: [adminEmbed] });
        await interaction.reply(`Dein Einspruch wurde unter der ID **#${caseId}** auf dem Server **${targetGuild.name}** eingereicht.`);
    },
};