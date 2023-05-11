const prefix = '!#';
const {EmbedBuilder, Permissions, Client} = require('discord.js');
fs = require('fs');

module.exports = {
    name: "leveling",
    description: "Leveling Server Intern",
    callback (client, interaction, args) {
        var xp = Math.floor(Math.random() * 10) + 20;



        fs.readFile(`Server/${message.member.guild.id.toString()}.json`, "utf8", async function (err,data) {
            if (err) {
                console.log(err);
            }

            var userid = message.member.id.toString()


            const json_data = JSON.parse(data);

            //Timestap überprüfen
            if (Date.now() - 60000 < json_data.user[userid].leveling.last_message_time) return;


            json_data.user[userid].leveling.message_count ++;
            //old_xp steht für die XP vor der Message
            var old_xp = json_data.user[userid]["leveling"].xp
            //new_xp steht für die XP nach der Message
            var new_xp = old_xp + xp
            json_data.user[userid]["leveling"].xp = new_xp

            //Timestap
            json_data.user[userid].leveling.last_message_time = Date.now()


            if (new_xp < 100) {
                //Level wir auf 0 gesetzt
                json_data.user[userid]["leveling"].levels = 0
            } else {
                //l steht für Level
                var l = json_data.user[userid]["leveling"].levels
                //richtiges Level wird gesucht durch ausprobieren
                while (new_xp > l*100) {
                    l++;
                }
                l = l - 1
                json_data.user[userid]["leveling"].levels = l
            }
            fs.writeFile(`Server/${message.member.guild.id.toString()}.json`, JSON.stringify(json_data), () => {})
        });
    }
}