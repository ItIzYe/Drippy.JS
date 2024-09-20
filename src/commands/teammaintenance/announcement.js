const GuildConfiguration = require('../../models/GuildConfiguration');
const ImageConfiguration = require('../../models/Images');
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');
const language = require("../../handlers/languages");


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'announcement',
    description: 'Create an Bot announcement',
    devOnly: true,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,
    options: [
        {
            name: 'message',
            description: 'Enter the message.',
            type: 3,
            required: true,
        },
        {
            name: 'message-type',
            description: 'Enter the message.',
            type: 3,
            required: true,
        },

    ],

    callback: async (client, interaction) => {
        //await interaction.deferReply();

        const announcement_message = interaction.options.get('message').value;
        const announcement_type = interaction.options.get('message-type').value;

        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('ANNOUNCEMENT - ANKÜNDIGUNG')
            .setDescription('The following Announcement will be broadcasted in english - Die folgende Ankündigung wird auf Englisch erscheinen')
            .setFields(
                {name: `${announcement_type}`, value: `${announcement_message}`, inline: true}
            )



        client.guilds.cache.forEach( guild =>{
            //console.log(guild.id)

            let guildConfiguration =  GuildConfiguration.findOne({ guildId: guild.id});
            const announcement_channel = client.channels.cache.get(`${guild.systemChannelId}`);

            //console.log(announcement_channel)
            try {
                if (guildConfiguration.announcementChannelIds && guildConfiguration.announcementChannelIds.length > 0) {
                    const messageChannel = client.channels.cache.get(guildConfiguration.announcementChannelIds[0])
                    //console.log(guildConfiguration.announcementChannelIds)
                    messageChannel.send({embeds: [embed]});
                } else {
                    announcement_channel.send({embeds: [embed]});
                }
            } catch (e) {
                console.log(`There was an error when announcing: ${error}`);
            }
        })

        interaction.reply("Announcement has been sent")

    },
};