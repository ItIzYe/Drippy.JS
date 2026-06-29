const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField, 
    ApplicationCommandOptionType,
    MessageFlags,
    AttachmentBuilder
} = require('discord.js');
const VerifyConfig = require('../../models/Verify');
const path = require('path');

module.exports = {
    name: 'setup-captcha-eu',
    description: 'Richtet die Verifizierung mit einer spezifischen Rolle ein',
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    options: [
        {
            name: 'rolle',
            description: 'Die Rolle, die nach der Verifizierung vergeben wird',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: 'channel',
            description: 'Der Kanal, in den die Appeals gesendet werden sollen.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const targetRole = interaction.options.getRole('rolle');
        const kanal = interaction.options.getChannel('channel');

        await VerifyConfig.findOneAndUpdate(
            { guildId: interaction.guildId },
            { roleId: targetRole.id },
            { upsert: true }
        );

        const dateiPfad = path.join(__dirname, '..', '..', 'img', 'perso.jpg'); 
        const bildAttachment = new AttachmentBuilder(dateiPfad, { name: 'perso.jpg' });

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Altersbestätigung')
            .setImage('attachment://perso.jpg')
            .setDescription(
                `Für den Zugriff auf die freigegebenen Bereiche dieses Servers ist eine Bestätigung des Mindestalters (16+) erforderlich.\n\n**Ablauf der Verifizierung:**\n`
            )
            .addFields(
              {name: "1.", value: `Wechsel in den Kanal ${kanal}.`, inline: false},
              {name: "2.", value: "Führe dort den Befehl \`/captcha-eu\` aus.", inline:false},
              {name: "3.", value: "Gib die **7-stellige Zahlenfolge** von der Rückseite seines Ausweises ein (Siehe Grafik).", inline:false},
              {name: "**DATENSCHUTZ- UND SICHERHEITSHINWEISE:**", value: `• Der Befehl wird als private Interaktion (*ephemeral*) ausgeführt. Ihre Eingabe ist für andere Servermitglieder nicht einsehbar.\n` +
        `• Die Daten werden ausschließlich flüchtig im Arbeitsspeicher verarbeitet, um den mathematischen Prüfalghorithmus (ICAO-9303-Standard) auszuführen. Eine Speicherung oder Protokollierung der Ziffern findet zu keinem Zeitpunkt statt.`}
            )
            .setColor('Blue');

        

        await interaction.channel.send({ embeds: [embed], files: [bildAttachment], });

        await interaction.reply({ 
            content: `Verifizierung eingerichtet! Ziel-Rolle: **${targetRole.name}**`, 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};