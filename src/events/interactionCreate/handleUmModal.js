const GuildConfiguration = require('../../models/GuildConfiguration');
const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    console.log(`Modal erhalten! ID: ${interaction.customId}`);

    if (interaction.customId !== 'umfrage_modal') return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const umfrage_message = interaction.fields.getTextInputValue('umfrage_message');

    const embed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle(`📢 FEEDBACK`)
        .setDescription(umfrage_message)
        .setTimestamp()
        .setFooter({ text: 'Umfrage' });


    const targetChannelId ='745715212266504352';
            const targetChannel = await client.channels.fetch(targetChannelId).catch(() => null);
    await targetChannel.send({ embeds: [embed] });
    

    await interaction.editReply({ 
        content: `Modal wurde erfolgreich versendet.` 
    });
};
