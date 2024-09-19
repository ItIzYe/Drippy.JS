const {Client , Interaction, ApplicationCommandOptionType} = require('discord.js');
const Level = require('../../models/Level.js');

module.exports = {
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

        await interaction.deferReply();

        const mentionedUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if(!fetchedLevel){
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} hat keine Level` : "Du hast keine Level"
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');
        allLevels.sort((a, b)=> {
            if(a.level === b.level){
                return b.xp - a.xp;
            }else {
               return b.level - a.level;
            }
        });
        let currentRank = allLevels.findIndex((lvl) => lvl.user.id === targetUserId) + 1;


    }
}
