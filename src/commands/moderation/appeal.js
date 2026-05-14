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
        try {
            // Holen der Eingabe des Users
            const focusedOption = interaction.options.getFocused(true);
            
            // Sicherstellen, dass wir nur auf das richtige Feld reagieren
            if (focusedOption.name !== 'server-id') return;

            const focusedValue = focusedOption.value.toLowerCase();
            
            // Schnell-Check: Wenn der Bot noch gar keine Guilds im Cache hat
            if (!client.guilds.cache.size) {
                return await interaction.respond([]);
            }

            // Map & Filter so effizient wie möglich
            const guilds = client.guilds.cache
                .filter(guild => guild.name.toLowerCase().includes(focusedValue))
                .map(guild => ({
                    name: guild.name,
                    value: guild.id
                }))
                .slice(0, 25);

            await interaction.respond(guilds);
        } catch (error) {
            // Ignoriere 10062 Fehler im Log, da sie oft durch Client-Lags entstehen
            if (error.code === 10062) return;
            console.error(`Autocomplete Fehler: ${error}`);
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
        if (!config || !config.appealChannelId?.length) {
            return interaction.reply("Dieser Server hat das Einspruch-System nicht konfiguriert.");
        }

        // Guild fetchen, falls nicht im Cache (wichtig in DMs!)
        const targetGuild = await client.guilds.fetch(guildId).catch(() => null);
        if (!targetGuild) return interaction.reply("Ich konnte den Server nicht finden.");

        const logChannel = targetGuild.channels.cache.get(config.appealChannelId[0]);
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