const prefix = '!#';
const {MessageEmbed, Permissions, Client} = require('discord.js');
//const { MessageButton, MessageActionRow } = require("discord-buttons");
fs = require('fs');

module.exports = {
    name: "leveling",
    description: "Leveling Server Intern",
    async execute (client, message) {
        var xp = Math.floor(Math.random() * 10) + 20;

        fs.readFile("Server/test.json", "utf8", async function (err,data) {
            if (err) {
                console.log(err);
            }

            var userid = "userid"//message.author.id

            const json_data = JSON.parse(data);
            //old_xp steht für die XP vor der Message
            var old_xp = json_data.user[userid]["leveling"].xp
            //new_xp steht für die XP nach der Message
            var new_xp = old_xp + xp
            json_data.user[userid]["leveling"].xp = new_xp

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
            //fs.writeFile("Server/test.json", JSON.stringify(json_data), () => {})
        });
    }
}