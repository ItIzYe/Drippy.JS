const { EmbedBuilder, Client, Interaction, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const Birthday = require('../../models/Birthday');
//const language = require("../../handlers/languages");

module.exports = {
    name: "birthday",
    description: "Setze deinen Geburtstag für den Reminder",
    options: [
        {
            name: 'day',
            description: 'Der Tag deines Geburtstags (1-31)',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 31,
        },
        {
            name: 'month',
            description: 'Der Monat deines Geburtstags (1-12)',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 12,
        }
    ],

    callback: async (client, interaction) => {
        const { guild, user, options } = interaction;
        const day = options.getInteger('day');
        const month = options.getInteger('month');

        if (month === 2 && day > 29) return interaction.reply({ content: "Der Februar hat keine 31 Tage!", flags: [MessageFlags.Ephemeral] });

        try {
            await Birthday.findOneAndUpdate(
                { userId: user.id, guildId: guild.id },
                { day, month },
                { upsert: true }
            );

            const successEmbed = new EmbedBuilder()
                .setColor("#1f8a4c")
                .setTitle("🎂 Geburtstag gespeichert!")
                .setDescription(`Ich werde mich am **${day}.${month}.** an deinen Ehrentag erinnern!`)
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed], flags: [MessageFlags.Ephemeral] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Fehler beim Speichern des Geburtstags.", flags: [MessageFlags.Ephemeral] });
        }
    }
}