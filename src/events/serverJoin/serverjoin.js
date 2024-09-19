const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, GuildChannelTypes} = require('discord.js');

module.exports = {
    name: 'guildCreate',
    callback: async (guild) => {

        async function sendMessage(channelId){
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('deleteNew')
                        .setLabel('🗑️')
                        .setStyle(ButtonStyle.Danger)
                );

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle('Thanks for the Invite!')
                .setDescription("Our Bot is still in the BETA so we'd really appreciate your feedback. You can do that by using `bug [bug Report]` to report us any Bugs that happened to you or by joining our Server and give us direct Feedback!")
                .setFooter({text: "Feel free to delete this message using the Button when you have read it!"});

            const sendChannel = await guild.channels.cache.get(channelId);
            var msg = await sendChannel.send({embeds: [embed], components: [button]});


            const collector = await msg.createMessageComponentCollector();
            collector.on('collect', async i => {
                if(i.customId === 'deleteNew'){
                    await msg.delete();
                }
            })
        }

        async function randomNum(length) {
            return await Math.floor(Math.random() * (length - 1 + 1));
        }

        if(guild.publicUpdatesChannel){
            sendMessage(guild.publicUpdatesChannel);
        } else if (guild.systemChannelId) {
            sendMessage(guild.systemChannelId);
        } else {
            var goodChannels = [];
            var badChannels = [];

            var channelFetch = await guild.channels.fetch();
            if(!channelFetch) return;

            await channelFetch.forEach(async channel => {
                if(channel.permissionsFor(guild.roles.everyone).has(PermissionsBitField.Flags.SendMessages) && channel.type === ChannelType.GuildText){
                    goodChannels.push(channel.id);
                } else if (channel.type === ChannelType.GuildText) {
                    badChannels.push(channel.id);
                } else {
                    return;
                }
            });

            if (goodChannels.length >= 1) {
                sendMessage(goodChannels[await randomNum(goodChannels.length)]);
            } else if (badChannels.length >= 1) {
                sendMessage(badChannels[await randomNum(badChannels.length)]);
            } else {
                return;
            }
        }
    }
}