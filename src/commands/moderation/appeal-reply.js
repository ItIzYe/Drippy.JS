const Appeal = require('../../models/Appeal');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'appeal-reply',
    description: 'Antworte auf einen Einspruch per DM.',
    options: [
        {
            name: 'case-id',
            description: 'Die Case ID des Einspruchs.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'message',
            description: 'Deine Antwort an den User.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'close',
            description: 'Soll der Fall geschlossen werden?',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],

    callback: async (client, interaction) => {
        const caseId = interaction.options.get('case-id').value.toUpperCase();
        const replyText = interaction.options.get('message').value;
        const shouldClose = interaction.options.get('close')?.value || false;

        const appeal = await Appeal.findOne({ caseId: caseId, status: 'open' });

        if (!appeal) {
            return interaction.reply({ content: "Kein offener Case mit dieser ID gefunden.", flags: [MessageFlags.Ephemeral] });
        }

        try {
            const targetUser = await client.users.fetch(appeal.userId);
            
            const replyEmbed = new EmbedBuilder()
                .setTitle(`Antwort vom Team zu Case #${caseId}`)
                .setDescription(replyText)
                .setColor(shouldClose ? 'Red' : 'Green')
                .setFooter({ text: shouldClose ? "Dieser Fall wurde geschlossen." : "Du kannst ggf. einen neuen Appeal senden." });

            await targetUser.send({ embeds: [replyEmbed] });

            if (shouldClose) {
                appeal.status = 'closed';
                await appeal.save();
            }

            await interaction.reply({ content: `Antwort an **${targetUser.tag}** gesendet!`, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
            await interaction.reply({ content: "DM konnte nicht gesendet werden.", flags: [MessageFlags.Ephemeral] });
        }
    },
};