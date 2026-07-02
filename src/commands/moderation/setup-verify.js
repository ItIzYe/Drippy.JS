const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField, 
    ApplicationCommandOptionType,
    MessageFlags // <--- Wichtig: Importieren
} = require('discord.js');
const VerifyConfig = require('../../models/Verify');

module.exports = {
    name: 'setup-verify',
    description: 'Richtet die Verifizierung mit einer spezifischen Rolle ein',
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    deleted: true,
    options: [
        {
            name: 'rolle',
            description: 'Die Rolle, die nach der Verifizierung vergeben wird',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const targetRole = interaction.options.getRole('rolle');

        await VerifyConfig.findOneAndUpdate(
            { guildId: interaction.guildId },
            { roleId: targetRole.id },
            { upsert: true }
        );

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Altersbestätigung')
            .setDescription(
                `Um Zugriff auf alle Kanäle zu erhalten, musst du bestätigen, dass du mindestens **16 Jahre alt** bist.\n\n` +
                `Bei Erfolg erhältst du die Rolle: ${targetRole}\n\n` +
                `❌ *Solltest du zu jung sein, klicke auf "Ich bin zu jung".*`
            )
            .setColor('Blue');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verify_age_confirm')
                .setLabel('Ich bin 16+')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('verify_age_deny')
                .setLabel('Ich bin zu jung')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.reply({ 
            content: `Verifizierung eingerichtet! Ziel-Rolle: **${targetRole.name}**`, 
            flags: [MessageFlags.Ephemeral] 
        });
    }
};