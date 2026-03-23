const { 
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, 
    StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, 
    MessageFlags
} = require('discord.js');
const Faq = require('../models/Faq');

module.exports = async (client, interaction) => {
    const guildId = interaction.guild.id;


    if (interaction.commandName === 'faq-admin') {
        const faqs = await Faq.find({ guildId });
        
        const embed = new EmbedBuilder()
            .setTitle('🛠️ FAQ Management Panel')
            .setDescription(`Aktuelle FAQs: ${faqs.length}\nNutze die Buttons unten zum Verwalten.`)
            .setColor('Grey');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('faq_add').setLabel('Neu Erstellen').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('faq_delete_list').setLabel('Löschen').setStyle(ButtonStyle.Danger)
        );

        return interaction.reply({ embeds: [embed], components: [row], Flags: [MessageFlags.Ephemeral] });
    }


    if (interaction.customId === 'faq_add') {
        const modal = new ModalBuilder().setCustomId('faq_modal_add').setTitle('Neue FAQ erstellen');

        const triggerInput = new TextInputBuilder().setCustomId('trigger').setLabel('Trigger (z.B. regeln)').setStyle(TextInputStyle.Short).setRequired(true);
        const questionInput = new TextInputBuilder().setCustomId('question').setLabel('Titel der Antwort').setStyle(TextInputStyle.Short).setRequired(true);
        const answerInput = new TextInputBuilder().setCustomId('answer').setLabel('Antworttext').setStyle(TextInputStyle.Paragraph).setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(triggerInput), new ActionRowBuilder().addComponents(questionInput), new ActionRowBuilder().addComponents(answerInput));
        return interaction.showModal(modal);
    }


    if (interaction.isModalSubmit() && interaction.customId === 'faq_modal_add') {
        const trigger = interaction.fields.getTextInputValue('trigger').toLowerCase();
        const question = interaction.fields.getTextInputValue('question');
        const answer = interaction.fields.getTextInputValue('answer');

        await Faq.findOneAndUpdate(
            { guildId, trigger }, 
            { question, answer }, 
            { upsert: true }
        );

        return interaction.reply({ content: `✅ FAQ \`${trigger}\` wurde gespeichert!`, flags: [MessageFlags.Ephemeral] });
    }
};