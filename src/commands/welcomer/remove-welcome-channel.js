const {Client, Interaction, PermissionsBitField, MessageFlags} = require("discord.js");
const welcomeChannelSchema = require('../../models/WelcomeChannel')
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: 'remove-welcome-channel',
    description: 'Remove a welcome channel',
    deleted: false,
    options: [
        {
            name: 'target-channel',
            description: 'Remove welcome channel',
            type: 7,
            required: true,
        },
    ],
    dmPermission: false,
    PermissionsRequired: [PermissionsBitField.Flags.Administrator],
    testOnly: true,


    callback: async (client, interaction) => {
        try{
            const targetChannel = interaction.options.getChannel('target-channel');

            await interaction.deferReply({flags: [MessageFlags.Ephemeral]});

            const query = {
                guildId: interaction.guildId,
                channelId: targetChannel.id,
            };

            const channelExistsInDb = await welcomeChannelSchema.exists(query);
            if(!channelExistsInDb){
                interaction.followUp('Dieser Kanal ist kein Willlkommenskanal');
                return;
            }

            welcomeChannelSchema.findOneAndDelete(query)
                .then(() => {
                    interaction.followUp(`${targetChannel} wurde als Willkommenskanal entfernt`)
                })
                .catch((e) =>{
                    interaction.followUp('Dtabase Fehler, bitte versuche es später erneut.')
                    console.log(`DB error in ${__filename}:\n`, e)
                });

        }catch(e) {
            console.log(`Error in ${__filename}:\n`, e);
        }
}
}