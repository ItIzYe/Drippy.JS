const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    GuildMember
} = require('discord.js');

const Level = require('../src/models/Level')
fs = require('fs');
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: "ranking",
    deleted: true,
    description: "Erstellt Server ranking",
    callback: async (client, interaction) => {

        let levelsArray = await Level.find({guildId: interaction.guild.id})
        //console.log(levelsArray.userID)
        const verifiedUser = levelsArray.map((user) => user)

        //console.log(Members)
        //let userXp = await Level.findOne({userId: Members[i]});
        //console.log(userXp)
        //console.log(verifiedUser[0])

        const test = JSON.parse(JSON.stringify(verifiedUser[0]))
        //console.log(test)
        //console.log(test.userID)

        Object.keys(test).forEach(function(item) {
        //    console.log("item")
        //    console.log(item)
        });

        //console.log(verifiedUser[0][0])
        /*let test = verifiedUser[0]
        //console.log(test)
        //console.log(test)
         interaction.guild.members.cache.forEach(member => {
            if(levelsArray.includes(member.user.id)){
                console.log(verifiedUser)
            }
            // ...
        });*/



    }
}
/*
[userid:]
verifiedUser[0][{userId}][

[
    {
        _id: new ObjectId("659dde2af9471a02f6b783d4"),
        userId: '716394389211185213',
        guildId: '865934977270546462',
        xp: 0,
        level: 0,
        __v: 0
    }
]
*/