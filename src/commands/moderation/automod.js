const prefix = '!#';
const {MessageEmbed, Permissions, Client} = require('discord.js');
fs = require('fs');


module.exports = {
    name: "automod",
    description: "Automod",
    callback (client, interaction, args) {
        fs.readFile(`Server/${interaction.member.guild.id.toString()}.json`, "utf8", async function (err,data) {
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


            var woerds = interaction.content.split(" ");
            //console.log(woerds);

            if (ignored_channels.includes(interaction.channel.id)) {
                return;
            }

            for (let i = 0; i < interaction.member._roles.length; i++) {
                if (ignored_roles.includes(interaction.member._roles[i])) {
                    console.log("Erlaubt!");
                    return;
                }

            }

            for (let i = 0; i < woerds.length; i++) {
                if (woerter.includes(woerds[i])) {
                    //console.log(woerds[i]);
                    interaction.reply(":x: These words are not allowed here! :x:");
                    interaction.delete();
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