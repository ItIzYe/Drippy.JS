const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = async (client, member) => {
    const channelId = "879640892565245992"; 
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle(`Willkommen auf ${member.guild.name}!`)
        .setDescription(`Bitte klicke auf den Button unten, um dich zu verifizieren und Zugriff auf den Server zu erhalten.`)
        .setColor('Blue');

    const button = new ButtonBuilder()
        .setCustomId(`verify_${member.id}`)
        .setLabel('Verifizieren')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await channel.send({ 
        content: `${member}, bitte verifiziere dich hier:`, 
        embeds: [embed], 
        components: [row] 
    });
};