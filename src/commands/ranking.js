const {MessageEmbed, Permissions, Client} = require('discord.js');
fs = require('fs');

module.exports = {
    name: "ranking",
    description: "Erstellt Server ranking",
    async execute (client, message) {

        for (var i of client.guilds.cache) {
            //Öffnet die JSON Datei
            fs.readFile(`Server/${message.member.guild.id.toString()}.json`, "utf8", function (err,data) {
                if (err) {
                    console.log(err);
                }

                var liste2 = [];


                var json_data = JSON.parse(data);

                //Für jeden Member auf dem Server
                Object.keys(json_data["user"]).forEach(key => {
                    liste2.push(`${json_data.user[key].leveling.xp} : ${json_data.user[key].id}`);
                });

                //Liste sortieren und umdrehen
                liste2.sort();
                liste2.reverse();

                //Für jedes Object in der Liste
                for (var p of liste2) {
                    var lp = p.split(" : ");
                    json_data.user[lp[1]].leveling.rank = liste2.indexOf(p) + 1;
                }

                //Speichers in der JSON File
                fs.writeFile(`Server/${message.member.guild.id.toString()}.json`, JSON.stringify(json_data), () => {});

        });
        }


        }
    }