const prefix = '!#';
const {MessageEmbed, Permissions, Client, Interaction} = require('discord.js');


module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "boost",
    description: "Get the Serverboost advantages",
    callback: async (client, interaction) => {

        var level_1a = "> :smile: +50 mehr Server Emoji Slots (Insgesamt 100)";
        var level_1b = "> :musical_note: 128 Kbps Audio Qualität";
        var level_1c = "> :desktop: Animiertes Server Icon";
        var level_2a = "> :smile: nochmal +50 mehr Server Emoji Slots (Insgesamt 150)";
        var level_2b = "> :musical_note: 256 Kbps Audio Qualität";
        var level_2c = "> :arrow_up: 50MB Upload Limit für alle Mitglieder";
        var level_2d = "> :frame_photo: Server Banner";
        var level_3a = "> :smile: nochmal +100 mehr Server Emoji Slots (Insgesamt 250)";
        var level_3b = "> :musical_note: 384 Kbps Audio Qualität";
        var level_3c = "> :arrow_up: 100MB Upload Limit für alle Mitglieder";



        const boostEmbed = new MessageEmbed()
            .setColor("#9b59b5")
            .setTitle("Serverboosting")
            .setDescription("Ihr habt die Möglichkeit unseren Server monatlich mit einem Nitro Boostzu boosten. " +
                "Ein Abonnement kostet entweder monatlich 9,99$ oder jährlich 99,99$. Im folgenden sind die jeweiligen " +
                "benötigten Boosts und Vorteile aufgeführt,es hat also auch Vorteile für euch und wir freuen uns über jeden einzelnen Boost!")
            .setImage("https://image.jimcdn.com/app/cms/image/transf/none/path/s8c4b5908f2506753/image/i7dd644426c419a0d/version/1619471203/image.png")
            .addFields(
                {name: "Level 1 - ab 2 Boosts", value: `${level_1a} \n ${level_1b} \n ${level_1c}`, inline: false},
                {name: "Level 2 - ab 7 Boosts", value: `${level_2a} \n ${level_2b} \n ${level_2c} \n ${level_2d}`, inline: false},
                {name: "Level 3 - ab 15 Boosts", value: `${level_3a} \n ${level_3b} \n ${level_3c}`}
            )
        await interaction.reply({embeds: [boostEmbed]});

    }
}