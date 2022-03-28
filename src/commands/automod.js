const prefix = '!#';
const {MessageEmbed, Permissions, Client} = require('discord.js');
//const { MessageButton, MessageActionRow } = require("discord-buttons");
fs = require('fs');


module.exports = {
    name: "automod",
    description: "Automod",
    async execute (client, message) {
        fs.readFile("Server/test.json", "utf8", async function (err,data) {
            if (err) {
                console.log(err);
            }

            //console.log(data);
            const json_data = JSON.parse(data);
            if (!json_data.automod.infos.aktiviert) {
                return;
            }
            const ignored_channels = json_data.automod.ignoredchannels;
            const ignored_roles = json_data.automod.ignoredroles;
            const woerter = json_data.automod.nachrichten;


            var woerds = message.content.split(" ");
            //console.log(woerds);

            if (ignored_channels.includes(message.channel.id)) {
                return;
            }

            for (let i = 0; i < message.member._roles.length; i++) {
                if (ignored_roles.includes(message.member._roles[i])) {
                    console.log("Erlaubt!");
                    return;
                }

            }

            for (let i = 0; i < woerds.length; i++) {
                if (woerter.includes(woerds[i])) {
                    //console.log(woerds[i]);
                    await message.reply(":x: These words are not allowed here! :x:");
                    await message.delete();
                    return 1;
                }
            }
        });

    }
};


/*
Alle Nachrichtenteile werden überprüft.
Alle Rollen werden überprüft, ob sie ignoriert werden sollen.
Entsprechender Kanal wird überprüft, ob er ignoriert werden soll.
Ein-/Ausschalten
Alles über JSON File gesteuert.
 */