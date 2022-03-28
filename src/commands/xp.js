const prefix = '!#';
const {MessageEmbed, Permissions, Client} = require('discord.js');
//const { MessageButton, MessageActionRow } = require("discord-buttons");
fs = require('fs');

module.exports = {
    name: "rank",
    description: "XP Abfrage",
    async execute (client, message, args) {
        fs.readFile("Server/test.json", "utf8", async function (err,data) {
            if (err) {
                console.log(err);
            }

            var userid = "userid"
            const json_data = JSON.parse(data);
            const author_id = message.member.id;
            const xp = json_data.user[userid].leveling.xp;
            const level = json_data.user[userid].leveling.levels;
            const xp_level = json_data.user[userid].leveling.xp_level;
            const message_count = json_data.user[userid].leveling.message_count;
            const rank = json_data.user[userid].leveling.rank;


            //console.log(message.member);
            //console.log(message.author);


            //embed

            const levelEmbed = new MessageEmbed()
                .setColor("#0015ff")
                .setTimestamp()
                .setTitle(`${message.author.username} - Level`)
                .setDescription("Here you can see information about your current level and your total XP as well as the XP of your current level.")
                .addFields(
                    {name: `Your current level: `, value: `${level}`},
                    {name: "Your current xp: ", value: `${xp}`},
                    {name: "This is how much XP you still need until the next level: ", value: "Still to come..."},
                    {name: "Your number of messages written: ", value: `${message_count}`},
                    {name: "Your current rank: ", value: `${rank}`}
                )


            console.log(xp);
            await message.reply({embeds: [levelEmbed]});
        });


    }
}