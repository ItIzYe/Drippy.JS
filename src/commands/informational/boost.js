const {EmbedBuilder, Permissions, Client, Interaction} = require('discord.js');
const language = require('../../handlers/languages')

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    name: "boost",
    description: "Get the Serverboost advantages",
    callback: async (client, interaction) => {
        const { guild } = interaction

        const level_1a = `${language(guild, 'BOOST_1A')}`;
        const level_1b = `${language(guild, 'BOOST_1B')}`;
        const level_1c = `${language(guild, 'BOOST_1C')}`;
        const level_2a = `${language(guild, 'BOOST_2A')}`;
        const level_2b = `${language(guild, 'BOOST_2B')}`;
        const level_2c = `${language(guild, 'BOOST_2C')}`;
        const level_2d = `${language(guild, 'BOOST_2D')}`;
        const level_3a = `${language(guild, 'BOOST_3A')}`;
        const level_3b = `${language(guild, 'BOOST_3B')}`;
        const level_3c = `${language(guild, 'BOOST_3C')}`;



        const boostEmbed = new EmbedBuilder()
            .setColor("#9b59b5")
            .setTitle("Serverboosting")
            .setDescription(`${language(guild, 'BOOST_EXPLANATION')}`)
            .setImage("https://image.jimcdn.com/app/cms/image/transf/none/path/s8c4b5908f2506753/image/i7dd644426c419a0d/version/1619471203/image.png")
            .addFields(
                {name: `${language(guild, 'BOOST_FIELD1')}`, value: `${level_1a} \n ${level_1b} \n ${level_1c}`, inline: false},
                {name: `${language(guild, 'BOOST_FIELD2')}`, value: `${level_2a} \n ${level_2b} \n ${level_2c} \n ${level_2d}`, inline: false},
                {name: `${language(guild, 'BOOST_FIELD3')}`, value: `${level_3a} \n ${level_3b} \n ${level_3c}`}
            )
        await interaction.reply({embeds: [boostEmbed]});

    }
}