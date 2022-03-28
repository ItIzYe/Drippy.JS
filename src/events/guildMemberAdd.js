const { MessageActionRow, MessageButton, MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "guildMemberAdd",
    description: "Member Join",
    async execute(client, member, join) {

        const jsonFilesUser = fs.readdirSync('./User/').filter(file => file.endsWith('.json'));

        if (!jsonFilesUser.includes(member.id + ".json")) {
            fs.readFile(`./copy_user.json`, "utf-8", async function (err, data) {
                if (err) {
                    console.log(err);
                }

                var json_data_user = JSON.parse(data);

                json_data_user.id = member.id.toString()

                fs.writeFile(`./User/${member.id}.json`, JSON.stringify(json_data_user), () => {});
            });
        }

        var exists = false;


        var channel = member.guild.channels.cache.get(member.guild.systemChannelId);

        fs.readFile(`./Server/${member.guild.id}.json`, "utf8", async function (err,data) {
            if (err) {
                console.log(err);
            }

            const json_data = JSON.parse(data);

            Object.keys(json_data["user"]).forEach(key => {


                if (json_data.user[key].id === member.id.toString() && exists === false) {
                    exists = true;
                }
            });

            if (exists === false) {

                fs.readFile(`./copy_member.json`, "utf8", async function (err, data2) {
                    if (err) {
                        console.log(err);
                    }

                    const json_data2 = JSON.parse(data2);

                    json_data.user[member.id.toString()] = json_data2;
                    json_data.user[member.id.toString()].id = member.id.toString()
                    fs.writeFile(`Server/${member.guild.id}.json`, JSON.stringify(json_data), () => {});

                });

            }

            if (!join) return;

            if (json_data.memberjoin.infos.channel !== null) {
                channel = member.guild.channels.cache.get(json_data.memberjoin.infos.channel);
            }

            var msg = `${member.user.username}#${member.user.discriminator} has joined the server. It's good to have you here. If you have any questions, please contact the support. Your ${member.guild.name}-Team`;

            if (json_data.memberjoin.message !== null) {
                msg = json_data.memberjoin.message.toString();
            }

            var col = "#00ff99";

            if (json_data.memberjoin.infos.color !== null) {
                col = json_data.memberjoin.infos.color.toString();
            }

            var thumb = member.guild.iconURL();

            if (json_data.memberjoin.infos.thumpnail === false) thumb = null;

            const messageEmbed = new MessageEmbed()
                .setTitle(member.guild.name.toString())
                .setDescription(msg.toString())
                .setColor(col.toString())
                .setTimestamp()
                .setThumbnail(thumb)

            const button = {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Sent by Drippy",
                        "style": 2,
                        "custom_id": "drippy",
                        "disabled": true
                    }
                ]
            }


            await channel.send({embeds: [messageEmbed], components: [button]})




        });




        //console.log(`${member.displayName} ist dem Server beigetreten`)

}
}