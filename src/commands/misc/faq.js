const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require('discord.js');
const Faq = require('../../models/Faq');

module.exports = {
    name: 'faq',
    description: 'Zeigt FAQ-Antworten an.',
    options: [
        {
            name: 'thema',
            description: 'Welches Thema möchtest du aufrufen? (Oder "list" für alle)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    //testOnly: true,

    callback: async (client, interaction) => {
        const query = interaction.options.getString('thema').toLowerCase();
        const guildId = interaction.guild.id;

        if (query === 'list') {
            const faqs = await Faq.find({ guildId });
            if (faqs.length === 0) return interaction.reply('Es sind noch keine FAQs hinterlegt.');

            const listEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📚 Verfügbare FAQ-Themen')
                .setDescription(faqs.map(f => `\`${f.trigger}\``).join(', '));
            
            return interaction.reply({ embeds: [listEmbed] });
        }


        const faq = await Faq.findOne({ guildId, trigger: query });

        if (!faq) {
            return interaction.reply({
                content: `❌ Das Thema \`${query}\` existiert nicht. Nutze \`/faq list\` für eine Übersicht.`,
                Flags: [MessageFlags.Ephemeral]
            });
        }

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(faq.question)
            .setDescription(faq.answer)
            .setFooter({ text: `Abgerufen von ${interaction.user.username}` });

        await interaction.reply({ embeds: [embed] });
    }
};