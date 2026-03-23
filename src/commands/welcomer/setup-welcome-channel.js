const {ApplicationCommandOptionType, PermissionsBitField, MessageFlags} = require("discord.js");
const welcomeChannelSchema = require('../../models/WelcomeChannel')
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'setup-welcome-message',
    description: 'Setup a channel to send welcome messages to.',
    deleted: false,
    options: [
        {
            name: 'target-channel',
            description: 'The Channel to get messages in',
            type: 7,
            required: true,
        },
        {
            name: 'custom-message',
            description: 'TEMPLATES: {mention-member} {username} {server-name} {member-count}',
            type: 3,
        },
    ],
    dmPermission: false,
    PermissionsRequired: [PermissionsBitField.Flags.Administrator],
    testOnly: true,


    callback: async (client, interaction) => {
        try{
            const targetChannel = interaction.options.getChannel('target-channel');
            const customMessage = interaction.options.getString('custom-message');

            await interaction.deferReply({flags: [MessageFlags.Ephemeral]});

            const query = {
                guildId: interaction.guildId,
                channelId: targetChannel.id,
            };

            const channelExistsInDb = await welcomeChannelSchema.exists({query});

            if(channelExistsInDb){
                interaction.followUp('Der Kanal ist schon ein Willkommenskanal')
                return;
            }

            const newWelcomChannel = new welcomeChannelSchema({
                ...query,
                customMessage
            });
            newWelcomChannel.save().then(() => {
                interaction.followUp(`${targetChannel} wurde als Willkomenskanal festgelegt`)
            }).catch((e) => {
                interaction.followUp('Database Fehler, bitte versuche es später erneut')
                console.log(`Fehler in ${__filename}:\n`, e)});

        }catch (e) {
            console.log(`Error in ${__filename}:\n`, e);
        }
    }
}