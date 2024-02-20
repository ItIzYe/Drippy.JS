const {Client , Interaction, ApplicationCommandOptionType} = require('discord.js')

module.export = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     *
     */
    name: 'level',
    description: "Shows your/someone's level.",
    options: [
        {name: 'target-user',
        description: "The user whose rank you want to see",
        type: ApplicationCommandOptionType.Mentionable}
    ],


    callback: async (client, interaction) => {
        if(!interaction.inGuild()){
            interaction.reply("Du kannst den Command nur in einem Server benutzen")
        }
    }
}
