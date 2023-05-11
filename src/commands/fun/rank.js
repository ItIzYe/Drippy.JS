const prefix = '!#';
const {Permissions, Client, GuildMember, EmbedBuilder} = require('discord.js');
const sleep = require("sleep-promise");
//const { MessageButton, MessageActionRow } = require("discord-buttons");
fs = require('fs');

module.exports = {
    name: "rank",
    description: "XP Abfrage",
    callback (client, interaction, member) {

        //Überprüft Member
        if (member === []) {
            member = interaction.author;
        } else {
            try {
                //Versucht die User ID zu bekommen und zu User umzuwandeln
                member[0] = member[0].split("<@!").join("").split(">").join("");
                member = client.users.cache.find(user => user.id === member[0]);
                if (member === null) {
                    member = interaction.author;
                }
                var test = interaction.id;
            }

            catch(error) {
                //Sonst ist Member = Message Author
                member = interaction.author;
            }
        }


        var guildid = interaction.guild.id
        //Führt guildMemberAdd aus

        client.events.get("guildMemberAdd").callback(client, member, false, guildid);
        sleep(200);


        fs.readFile(`Server/${interaction.member.guild.id.toString()}.json`, "utf8", async function (err,data) {
            if (err) {
                console.log(err);
            }

            //Hohlt sich alle Infos fürs Ranking

            var userid = member.id.toString()
            
            const json_data = JSON.parse(data);
            const xp = json_data.user[userid].leveling.xp;
            const level = json_data.user[userid].leveling.levels;
            const xp_level = json_data.user[userid].leveling.xp_level;
            const message_count = json_data.user[userid].leveling.message_count;
            const rank = json_data.user[userid].leveling.rank;



            //embed

            const levelEmbed = new EmbedBuilder()
                .setColor("#0015ff")
                .setTimestamp()
                .setTitle(`${member.username} - Level`)
                .setDescription("Here you can see information about your current level and your total XP as well as the XP of your current level.")
                .addFields(
                    {name: `Your current level: `, value: `${level}`},
                    {name: "Your current xp: ", value: `${xp}`},
                    {name: "This is how much XP you still need until the next level: ", value: "Still to come..."},
                    {name: "Your number of messages written: ", value: `${message_count}`},
                    {name: "Your current rank: ", value: `${rank}`}
                )

            interaction.reply({embeds: [levelEmbed]});
        });


    }
}