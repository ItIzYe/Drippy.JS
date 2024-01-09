const welcomeMessageSchema = require('../../models/WelcomeChannel')


/**
 *
 *
 * @param {import('discord.js').GuildMember} guildMember
 */
module.exports = async (guildMember) => {
    try{
        if(guildMember.user.bot) return;

        const welcomeConfigs = await welcomeMessageSchema.find({
            guildId: guildMember.guild.id
        });

        if(!welcomeConfigs.length) return;

        for(const welcomeConfig of welcomeConfigs) {
            const targetChannel = guildMember.guild.channels.get(welcomeConfig.channelId) ||
                (await guildMember.guild.channels.fetch(welcomeConfig.channelId));
            if(!targetChannel){
                welcomeChannelSchema.findOneAndDelete({
                    guildId: guildMember.guild.id,
                    channelId: welcomeConfig.channelId
                }).catch((e) =>{});
            }

            const customMessage = welcomeConfig.customMessage || 'Hey {username}👋. Willkommen auf {server-name}!';

            const welcomeMessage = customMessage
                .replace('{mention-member}', `<@${guildMember.id}>`)
                .replace('{username}', guildMember.user.username)
                .replace('{server-name}', guildMember.guild.name)
                .replace('{member-count}', String(guildMember.guild.approximateMemberCount));

            targetChannel.send(welcomeMessage).catch(() => {});

        }

    } catch (e) {
        console.log(`Error on ${__filename}\n`, e)

    }
}