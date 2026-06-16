const { EmbedBuilder, Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const language = require("../../handlers/languages");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "timestamp",
    description: "Convert a time into a dynamic Discord timestamp",
    options: [
        {
            name: 'time',
            description: 'Format: HH:MM (e.g. 20:00)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'date',
            description: 'Format: DD.MM.YYYY (optional, default is today)',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        const { guild } = interaction;

        const timeInput = interaction.options.getString('time');
        const dateInput = interaction.options.getString('date');

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        const dateRegex = /^([0-2]?[0-9]|3[0-1])\.(0?[1-9]|1[0-2])\.([0-9]{4})$/;

        if (!timeRegex.test(timeInput)) {
            return interaction.reply({
                content: '❌ **Ungültiges Uhrzeit-Format!** Bitte nutze das Format `HH:MM` (z. B. `20:00`).',
                ephemeral: true
            });
        }

        const [, hours, minutes] = timeInput.match(timeRegex);

        let day, month, year;
        const now = new Date();

        if (dateInput) {
            if (!dateRegex.test(dateInput)) {
                return interaction.reply({
                    content: '❌ **Ungültiges Datums-Format!** Bitte nutze das Format `DD.MM.YYYY` (z. B. `16.06.2026`).',
                    ephemeral: true
                });
            }
            [, day, month, year] = dateInput.match(dateRegex);
        } else {
            day = now.getDate();
            month = now.getMonth() + 1;
            year = now.getFullYear();
        }

        const targetDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

        if (isNaN(targetDate.getTime())) {
            return interaction.reply({
                content: '❌ Das angegebene Datum existiert im Kalender nicht!',
                ephemeral: true
            });
        }

        const unixTimestamp = Math.floor(targetDate.getTime() / 1000);

        const timestampEmbed = new EmbedBuilder()
            .setColor("#8BBEEF")
            .setTitle(`🕒 ${language(guild, 'TS_TITLE')}`)
            .setDescription(
                `Hier sind die fertigen Formatierungscodes für deine Nachrichten.\n` +
                `Kopiere den Code (inklusive \`<>\`) und füge ihn in Ankündigungen ein.\n\n` +
                `**Eingestellt:** \`${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year} - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}\``
            )
            .addFields(
                { 
                    name: '⏳ Relative Anzeige (z.B. für Events)', 
                    value: `Vorschau: <t:${unixTimestamp}:R>\nCode: \`<t:${unixTimestamp}:R>\``, 
                    inline: false 
                },
                { 
                    name: '📅 Datum & Uhrzeit', 
                    value: `Vorschau: <t:${unixTimestamp}:F>\nCode: \`<t:${unixTimestamp}:F>\``, 
                    inline: false 
                },
                { 
                    name: '⏰ Nur Uhrzeit', 
                    value: `Vorschau: <t:${unixTimestamp}:t>\nCode: \`<t:${unixTimestamp}:t>\``, 
                    inline: true 
                },
                { 
                    name: '📆 Nur Datum', 
                    value: `Vorschau: <t:${unixTimestamp}:d>\nCode: \`<t:${unixTimestamp}:d>\``, 
                    inline: true 
                }
            )
            .setTimestamp()
            .setFooter({ text: `${client.user.username} Utility System`, iconURL: client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [timestampEmbed], ephemeral: true });
    }
}