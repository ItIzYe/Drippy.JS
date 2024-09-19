const {
    Client,
        Interaction,
        ButtonInteraction,
        ApplicationCommandOptionType,
        PermissionFlagsBits, Permissions,EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

module.exports = {
    name: 'meme',
    description: 'Replies with the a meme!',
    devOnly: true,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: async (client, interaction) => {

        async function meme() {
            try {
                await fetch(`https://reddit.com/r/memes/random/.json`)
                    .then(async r => {
                        let meme = await r.json();

                        let title = meme[0].data.children[0].data.title;
                        let image = meme[0].data.children[0].data.url;
                        let author = meme[0].data.children[0].data.author;

                        const embed = new EmbedBuilder()
                            .setColor(0x0099ff)
                            .setTitle(title)
                            .setImage(image)
                            .setURL(image)
                            .setFooter({text: author})

                        interaction.editReply(
                            {embeds: [embed]}
                        );
                    })
            } catch (e) {
                console.log(e);
            }
        }
        try {
            meme()

            await interaction.deferReply();
            const subReddit = "meme"

            const response = await fetch('https://meme-api.com/gimme');
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(data.title)
                .setURL(data.postLink)
                .setImage(data.url)
                .setFooter({text: `👍 ${data.ups} | 💬 ${data.comments}`,})


            interaction.editReply(
                {embeds: [embed]}
            );
        } catch (e) {
            interaction.editReply(`Dieser Command funktioniert leider nicht, das Dev-Team wurde informiert\n\nErrorcode: ${e}`)

        }
    },
};