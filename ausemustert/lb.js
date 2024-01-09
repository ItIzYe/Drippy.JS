const {MessageEmbed, Permissions, Client, MessageActionRow, MessageButton} = require('discord.js');
const fs = require('fs');
const sleep = require('sleep-promise');


module.exports = {
    name: "lb",
    description: "leaderboard",
    async execute(client, message) {

        fs.readFile(`Server/${message.member.guild.id.toString()}.json`, "utf8", function (err,data) {
            if (err) {
                console.log(err);
            }

            var liste = [];
            var liste2 = [];

            var json_data = JSON.parse(data);

            //Für jeden Member auf dem Server
            Object.keys(json_data["user"]).forEach(key => {
                liste2.push(`${json_data.user[key].leveling.xp} : ${json_data.user[key].id} : ${json_data.user[key].leveling.levels}`);
            });

            //Liste sortieren und umdrehen
            liste2.sort();
            liste2.reverse();

            //Für jedes Object in der Liste
            var x = 1;
            for (var p of liste2) {
                var lp = p.split(" : ");
                var user = client.users.cache.find(user => user.id === lp[1]);
                liste.push(`${x}. ${user.username}#${user.discriminator} • Level ${lp[2]}\n`);
                x++;
            }

            const lbEmbed = new MessageEmbed()
                .setTitle(`${message.guild.name} Leaderboard`)
                .setDescription(`This is the leaderboard of the ${message.guild.name} guild.`)
                .setColor("#0082ff")
                .addField("⠀", liste.join(""))
                .setTimestamp()
                .setThumbnail(message.guild.iconURL())


            message.reply({
                embeds: [lbEmbed]
            });


        });
    }
}