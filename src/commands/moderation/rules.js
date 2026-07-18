const Rule = require('../../models/Rule');
const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'rules',
    description: 'Verwalte Regeln ohne jemals IDs nutzen zu müssen.',
    options: [
        {
            name: 'add',
            description: 'Neue Regel hinzufügen.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'unterpunkt',
                    description: 'Soll dies ein Unterpunkt sein?',
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
                {
                    name: 'einfügen_nach',
                    description: 'Hinter welcher Regel soll dieser Punkt erscheinen? (Leer lassen für ganz unten)',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    autocomplete: true,
                }
            ]
        },
        {
            name: 'list',
            description: 'Alle Regeln anzeigen.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'remove',
            description: 'Einen Punkt entfernen.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'regel',
                    description: 'Wähle die Regel aus, die gelöscht werden soll.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                }
            ]
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.EmbedLinks],

    autocomplete: async (client, interaction) => {
        const ruleData = await Rule.findOne({ guildId: interaction.guildId });
        if (!ruleData || !ruleData.rules.length) return interaction.respond([]);

        const focusedValue = interaction.options.getFocused();
        
        let mainPara = 0;
        let subPara = 0;

        const choices = ruleData.rules.map((rule, index) => {
            if (!rule.isSubParagraph) { mainPara++; subPara = 0; } else { subPara++; }
            const label = rule.isSubParagraph ? `§${mainPara}.${subPara}` : `§${mainPara}`;
            
            return {
                name: `${label} ${rule.title}`,
                value: index.toString(),
            };
        });

        const filtered = choices.filter(choice => 
            choice.name.toLowerCase().includes(focusedValue.toLowerCase())
        ).slice(0, 25);

        await interaction.respond(filtered);
    },

    callback: async (client, interaction) => {
        const { guild, guildId, options } = interaction;
        const subcommand = options.getSubcommand();

        if (subcommand === 'add') {
            const isSub = options.getBoolean('unterpunkt');
            const afterIndex = options.getString('einfügen_nach');

            const modal = new ModalBuilder()
                .setCustomId(`rule_modal_${interaction.user.id}_${isSub}_${afterIndex || 'end'}`)
                .setTitle(isSub ? 'Unterpunkt erstellen' : 'Hauptpunkt erstellen');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('rule_title').setLabel('Überschrift').setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('rule_desc').setLabel('Beschreibung').setStyle(TextInputStyle.Paragraph).setRequired(true)
                )
            );

            await interaction.showModal(modal);

            try {
                const submitted = await interaction.awaitModalSubmit({
                    time: 60000,
                    filter: i => i.customId.startsWith(`rule_modal_${interaction.user.id}`)
                });

                const title = submitted.fields.getTextInputValue('rule_title');
                const description = submitted.fields.getTextInputValue('rule_desc');

                let ruleData = await Rule.findOne({ guildId });
                if (!ruleData) ruleData = new Rule({ guildId, rules: [] });

                const newRule = { title, description, isSubParagraph: isSub };

                if (afterIndex !== null && !isNaN(parseInt(afterIndex))) {
                    ruleData.rules.splice(parseInt(afterIndex) + 1, 0, newRule);
                } else {
                    ruleData.rules.push(newRule);
                }

                await ruleData.save();
                await submitted.reply({ content: '✅ Regelwerk erfolgreich aktualisiert!', Flags: [MessageFlags.Ephemeral] });
            } catch (err) { return; }
            return;
        }

        await interaction.deferReply();
        let ruleData = await Rule.findOne({ guildId });

        if (subcommand === 'remove') {
            const index = parseInt(options.getString('regel'));

            if (!ruleData || isNaN(index) || !ruleData.rules[index]) {
                return interaction.editReply('❌ Regel konnte nicht gefunden werden.');
            }

            ruleData.rules.splice(index, 1);
            await ruleData.save();
            return interaction.editReply('🗑 Regel wurde erfolgreich entfernt.');
        }

        if (subcommand === 'list') {
    if (!ruleData || ruleData.rules.length === 0) {
        const noRulesEmbed = new EmbedBuilder()
            .setTitle(`📜 Server-Regeln: ${guild.name}`)
            .setColor('Blue')
            .setDescription('Keine Regeln definiert.');
        return await interaction.editReply({ embeds: [noRulesEmbed] });
    }

    const embeds = [];
    let currentEmbed = new EmbedBuilder()
        .setTitle(`📜 Server-Regeln: ${guild.name} (Teil 1)`)
        .setColor('Blue');

    let mainPara = 0;
    let subPara = 0;
    let currentFieldsCount = 0;
    let currentCharacterCount = currentEmbed.data.title.length;

    ruleData.rules.forEach((rule) => {
        if (!rule.isSubParagraph) { 
            mainPara++; 
            subPara = 0; 
        } else { 
            subPara++; 
        }
        const label = rule.isSubParagraph ? `§${mainPara}.${subPara}` : `§${mainPara}`;
        const fieldName = `${label} ${rule.title}`;
        const fieldValue = rule.description;
        
        const fieldLength = fieldName.length + fieldValue.length;

        if (currentFieldsCount >= 25 || (currentCharacterCount + fieldLength) > 5500) {
            embeds.push(currentEmbed); // Altes Embed wegspeichern
            
            currentEmbed = new EmbedBuilder()
                .setTitle(`📜 Server-Regeln: ${guild.name} (Teil ${embeds.length + 1})`)
                .setColor('Blue');
                
            currentFieldsCount = 0;
            currentCharacterCount = currentEmbed.data.title.length;
        }

        currentEmbed.addFields({ name: fieldName, value: fieldValue });
        currentFieldsCount++;
        currentCharacterCount += fieldLength;
    });

    embeds.push(currentEmbed);

    if (embeds.length === 1) {
        embeds[0].setTitle(`📜 Server-Regeln: ${guild.name}`);
    }

    if (embeds.length > 10) {
        for (let i = 0; i < embeds.length; i += 10) {
            const chunk = embeds.slice(i, i + 10);
            if (i === 0) {
                await interaction.editReply({ embeds: chunk });
            } else {
                await interaction.followUp({ embeds: chunk });
            }
        }
    } else {
        await interaction.editReply({ embeds: embeds });
    }
}
    },
};