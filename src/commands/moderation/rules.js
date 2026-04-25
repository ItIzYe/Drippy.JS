const Rule = require('../../models/Rule');
const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
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
                    autocomplete: true, // Nutzt die Liste der Regeln
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

    // DER AUTOCOMPLETE HANDLER (wird von add und remove genutzt)
    autocomplete: async (client, interaction) => {
        const ruleData = await Rule.findOne({ guildId: interaction.guildId });
        if (!ruleData || !ruleData.rules.length) return interaction.respond([]);

        const focusedValue = interaction.options.getFocused();
        
        // Wir erstellen eine Liste aller Regeln mit ihrer Bezeichnung
        let mainPara = 0;
        let subPara = 0;

        const choices = ruleData.rules.map((rule, index) => {
            if (!rule.isSubParagraph) { mainPara++; subPara = 0; } else { subPara++; }
            const label = rule.isSubParagraph ? `§${mainPara}.${subPara}` : `§${mainPara}`;
            
            return {
                name: `${label} ${rule.title}`,
                value: index.toString(), // Wir schicken den Index als "Value" an den Callback
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
            const afterIndex = options.getString('einfügen_nach'); // Das ist der Index der gewählten Regel

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
                    // Wir fügen es EINE Position hinter der gewählten Regel ein (+1)
                    ruleData.rules.splice(parseInt(afterIndex) + 1, 0, newRule);
                } else {
                    ruleData.rules.push(newRule);
                }

                await ruleData.save();
                await submitted.reply({ content: '✅ Regelwerk erfolgreich aktualisiert!', ephemeral: true });
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
            const embed = new EmbedBuilder()
                .setTitle(`📜 Server-Regeln: ${guild.name}`)
                .setColor('Blue');

            if (!ruleData || ruleData.rules.length === 0) {
                embed.setDescription('Keine Regeln definiert.');
            } else {
                let mainPara = 0;
                let subPara = 0;
                ruleData.rules.forEach((rule) => {
                    if (!rule.isSubParagraph) { mainPara++; subPara = 0; } else { subPara++; }
                    const label = rule.isSubParagraph ? `§${mainPara}.${subPara}` : `§${mainPara}`;

                    embed.addFields({ name: `${label} ${rule.title}`, value: rule.description });
                });
            }
            await interaction.editReply({ embeds: [embed] });
        }
    },
};