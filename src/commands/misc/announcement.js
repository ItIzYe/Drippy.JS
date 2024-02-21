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
        await interaction.deferReply();

        const announcement_message = interaction.options.get('message').value;
        const announcement_type = interaction.options.get('message-type').value;

        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('ANNOUNCEMENT - ANKÜNDIGUNG')
            .setDescription('The following Announcement will be broadcasted in english - Die folgende Ankündigung wird auf Englisch erscheinen')
            .setFields(
                {name: `${announcement_type}`, value: `${announcement_message}`, inline: true}
            )

        for(const guild of client.guilds.cache){
            //console.log(guild)

            const announcement_channel = client.channels.cache.get(`${guild[1].systemChannelId}`);
            console.log(announcement_channel)
            await announcement_channel.send({embeds: [embed]});

        }
        interaction.reply("Announcement has been sent")

    },
};