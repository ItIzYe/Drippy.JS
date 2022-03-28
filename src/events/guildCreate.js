const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "guildCreate",
    description: "Guild Join",
    async execute(client, guild, join) {

        const jsonFiles = fs.readdirSync('./Server/').filter(file => file.endsWith('.json'));


        //console.log(jsonFiles);

        if (jsonFiles.includes(`${guild.id}.json`)) {
            console.log("False");
        } else {

            fs.readFile("copy_file.json", "utf8", async function (err,data) {
                if (err) {
                    console.log(err);
                }


                fs.writeFile(`Server/${guild.id}.json`, data, () => {});

            });
        }


        if (!join) return;



        const owner = client.users.cache.find(user => user.id === guild.ownerId);



        var channel = guild.channels.cache.get(guild.systemChannelId);
        const channel2 = client.channels.cache.get("869657552072368138")

        if (channel == null) {
            channel = client.users.cache.find(user => user.id === guild.ownerId);
            var invite = "- Nachricht wurde an Owner gesendet -"
        } else {
            var invite = await channel.createInvite(unique=true);
        }



        const msg = `Drippy ist dem "${guild.name}" Server beigetreten. Die Guild ID ist: "${guild.id}.` +
            ` Der Server hat ${guild.member_count} Mitglieder." Invite: ${invite} . Der Owner ist ${owner.username}#${owner.discriminator}`;
        await channel2.send({content: msg.toString()});

        const gjEmbed = new MessageEmbed()
            .setTitle(guild.name.toString())
            .setDescription("Good morning, it's nice that you invited this bot here! Drippy is still under development. " +
                "Please report bugs with #bug (bug). These will be sent automatically to the main server of Drippy. With" +
                " #help you can find information about the different categories and commands. With #info you get some " +
                "information about the bot. Have fun! For more detailed questions, please contact ItIzYe#7590, R.M.S Titanic#7956 or CanadianAgent | Jury#9388.")
            .setThumbnail(guild.iconURL())
            .setTimestamp()
            .setColor("#0095ff")


        await channel.send({embeds: [gjEmbed]})





        console.log(`Drippy ist einem Server beigetreten`)

    }
}