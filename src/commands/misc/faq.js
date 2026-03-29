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
        {
            name: 'target-user',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        },
    ],
    //testOnly: true,

    callback: async (client, interaction) => {
        //await interaction.deferReply();
        const targetUser = interaction.options.getUser('target-user') || interaction.user;
        //const targetUser = await interaction.guild.members.fetch(targetUserId.id);
        const member = await interaction.guild.members.fetch(targetUser.id);
        const query = interaction.options.getString('thema').toLowerCase();
        const guildId = interaction.guild.id;

        if (query === 'list') {
            const faqs = await Faq.find({ guildId });
            if (faqs.length === 0) return interaction.reply('Es sind noch keine FAQs hinterlegt.');

            const listEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📚 Verfügbare FAQ-Themen')
                .setDescription(faqs.map(f => `\`${f.trigger}\``).join(', '));
            
            return interaction.reply(`${targetUser}`,{ embeds: [listEmbed] });
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
        if(targetUser === interaction.user){
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({content: `${targetUser}`, embeds: [embed] });
        }
    }
};