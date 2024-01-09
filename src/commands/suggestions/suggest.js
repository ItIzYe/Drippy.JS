const GuildConfiguration = require('../../models/GuildConfiguration')
const Suggestion = require('../../models/Suggestion')
const {Modal, TextInputComponent, TextInputStyle, MessageActionRow, ModalOptions, ModalActionRowComponentOptions, ModalMessageModalSubmitInteraction} = require('discord.js')

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} param0
     */
    name: 'suggest',
    description: 'Create a suggestion',
    dmPermission: false,

    callback: async(client, interaction) => {
        const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId});

        if(!guildConfiguration?.suggestionChannelIds.length) {
            await interaction.reply("Der Server wurde noch nicht für Suggestions konfiguriert. Bitte wende dich an einen Administratoren für die freischaltung");
            return;
        }

        if(!guildConfiguration.suggestionChannelIds.includes(interaction.channelId)){
            await interaction(`Dieser Kanal wurde nicht für suggestions eingerichtet. Bitte versuche einen dieser Kanäle: ${guildConfiguration.suggestionChannelIds.map((id) => `<#${id}>`).join(',')}`);
            return;
        }

        const modal = new Modal()
            .setTitle('Erstelle eine Suggestion')
            .setCustomId(`suggestion-${interaction.user.id}`)
            .addComponents([
                new TextInputComponent()
                .setCustomId('suggestion-input')
                .setLabel('Dein Vorschlag')
                .setStyle('PARAGRAPH')
                .setRequired(true)
                .setMaxLength(1000)])



        //const actionRow = new MessageActionRow().addComponents(textInput)

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

        const suggestionText = modalInteraction.get('suggestion-input').value;

        const newSuggestion = new Suggestion({
            authorId: interaction.user.id,
            guildId: interaction.guildId,
            message: suggestionMessage.id,
            content: suggestionText.toString(),
            });

        await newSuggestion.save();

        modalInteraction.editReply('Suggestion wurde erstellt');
    }
}