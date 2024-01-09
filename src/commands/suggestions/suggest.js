const GuildConfiguration = require('../../models/GuildConfiguration')
const Suggestion = require('../../models/Suggestion')
const {TextInputStyle,ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js')
const formatResults = require('../../utils/formatResults');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} param0.interaction
     * @param {Object} param0
     */
    name: 'suggest',
    description: 'Create a suggestion',
    dmPermission: false,

    callback: async(client, interaction) => {
        try{
            const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId});

            if(!guildConfiguration?.suggestionChannelIds.length) {
                await interaction.reply("Der Server wurde noch nicht für Suggestions konfiguriert. Bitte wende dich an einen Administratoren für die freischaltung");
                return;
            }

            if(!guildConfiguration.suggestionChannelIds.includes(interaction.channelId)){
                await interaction(`Dieser Kanal wurde nicht für suggestions eingerichtet. Bitte versuche einen dieser Kanäle: ${guildConfiguration.suggestionChannelIds.map((id) => `<#${id}>`).join(',')}`);
                return;
            }

            const modal = new ModalBuilder()
                .setTitle('Erstelle eine Suggestion')
                .setCustomId(`suggestion-${interaction.user.id}`)

            const textInput = new TextInputBuilder()
                .setCustomId('suggestion-input')
                .setLabel('Was willst du vorschlagen?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(1000);



            const actionRow = new ActionRowBuilder().addComponents(textInput)

            modal.addComponents(actionRow);

            await interaction.showModal(modal)

            const filter = (i) => i.customId === `suggestion-${interaction.user.id}`;

            const modalInteraction = await interaction.awaitModalSubmit({
                filter,
                time: 1000 * 60 * 3,
            }).catch((error) => console.log(error));

            await modalInteraction.deferReply({ephemeral: true});

            let suggestionMessage;

            try {
                suggestionMessage = await interaction.channel.send('Suggestion wird erstellt...');
            } catch (error) {
                modalInteraction.editReply('Suggestion konnte nicht erstellt werden');
                return;
            }

            const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-input');

            const newSuggestion = new Suggestion({
                authorId: interaction.user.id,
                guildId: interaction.guildId,
                messageId: suggestionMessage.id,
                content: suggestionText,
            });

            await newSuggestion.save();

            modalInteraction.editReply('Suggestion wurde erstellt');

            const suggestionEmbed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({size: 256})
                })
                .addFields([
                    {name: 'Suggestion', value: suggestionText},
                    {name: 'Status', value: '⌛ Pending'},
                    {name: 'Votes', value: formatResults()}
                ])
                .setColor('Yellow');


            const upvoteButton = new ButtonBuilder()
                .setEmoji('👍')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

            const downvoteButton = new ButtonBuilder()
                .setEmoji('👎')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

            const approveButton = new ButtonBuilder()
                .setEmoji('✅')
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);

            const rejectButton = new ButtonBuilder()
                .setEmoji('🗑️')
                .setLabel('Reject')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);

            const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
            const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

            suggestionMessage.edit({
                content: `${interaction.user} Suggestion created`,
                embeds: [suggestionEmbed],
                components: [firstRow, secondRow]
            })
        } catch (error){
            console.log(`Error in suggest.js ${error}`)
        }
    }


}