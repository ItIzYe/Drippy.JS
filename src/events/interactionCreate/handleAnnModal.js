const GuildConfiguration = require('../../models/GuildConfiguration');
const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    console.log(`Modal erhalten! ID: ${interaction.customId}`);

    if (interaction.customId !== 'announcement_modal') return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const announcement_type = interaction.fields.getTextInputValue('announcement_type');
    const announcement_message = interaction.fields.getTextInputValue('announcement_message');

    const embed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle(`📢 ${announcement_type.toUpperCase()}`)
        .setDescription(announcement_message)
        .setTimestamp()
        .setFooter({ text: 'Global Announcement' });

    const guilds = client.guilds.cache.values();
    let successCount = 0;

    for (const guild of guilds) {
        try {
            const config = await GuildConfiguration.findOne({ guildId: guild.id });
            let targetChannel;

            if (config?.announcementChannelIds?.length > 0) {
                targetChannel = await client.channels.fetch(config.announcementChannelIds[0]).catch(() => null);
            } else {
                targetChannel = guild.systemChannel;
            }

            if (targetChannel) {
                await targetChannel.send({ embeds: [embed] });
                successCount++;
            }
        } catch (err) {
            console.error(`Fehler in Guild ${guild.id}: ${err.message}`);
        }
    }

    await interaction.editReply({ 
        content: `Die Ankündigung wurde erfolgreich an **${successCount}** Server gesendet.` 
    });
};
