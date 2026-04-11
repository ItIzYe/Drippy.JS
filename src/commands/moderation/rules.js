const Rule = require('../../models/Rule'); // Pfad zu deinem Rule-Model
const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

const language = require("../../handlers/languages");

module.exports = {
    name: 'rules',
    description: 'Manage the server rules with paragraphs and modals.',
    options: [
        {
            name: 'add',
            description: 'Add a new rule via a form.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'list',
            description: 'Display all current rules.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'remove',
            description: 'Remove a specific paragraph.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'number',
                    description: 'The paragraph number (§) you want to remove.',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                }
            ]
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.EmbedLinks],

    callback: async (client, interaction) => {
        const { guild, guildId, options } = interaction;
        const subcommand = options.getSubcommand();

        // --- SUBCOMMAND: ADD (Modal öffnen) ---
        if (subcommand === 'add') {
            const modal = new ModalBuilder()
                .setCustomId(`rule_modal_${interaction.user.id}`)
                .setTitle(language(guild, 'RULES_MODAL_TITLE'));

            const titleInput = new TextInputBuilder()
                .setCustomId('rule_title')
                .setLabel(language(guild, 'RULES_INPUT_TITLE_LABEL'))
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const descInput = new TextInputBuilder()
                .setCustomId('rule_desc')
                .setLabel(language(guild, 'RULES_INPUT_DESC_LABEL'))
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descInput)
            );

            await interaction.showModal(modal);

            // Modal Submit abfangen
            try {
                const submitted = await interaction.awaitModalSubmit({
                    time: 60000,
                    filter: i => i.customId === `rule_modal_${interaction.user.id}`
                });

                const title = submitted.fields.getTextInputValue('rule_title');
                const description = submitted.fields.getTextInputValue('rule_desc');

                let ruleData = await Rule.findOne({ guildId });
                if (!ruleData) ruleData = new Rule({ guildId, rules: [] });

                ruleData.rules.push({ title, description });
                await ruleData.save();

                await submitted.reply({ 
                    content: `✅ ${language(guild, 'RULES_ADDED_SUCCESS')} (§${ruleData.rules.length})`, 
                    ephemeral: true 
                });
            } catch (err) {
                // Timeout oder Fehler
                return;
            }
            return;
        }

        // --- SUBCOMMAND: LIST & REMOVE (Standard-Interaction Handling) ---
        await interaction.deferReply();

        let ruleData = await Rule.findOne({ guildId });

        if (subcommand === 'remove') {
            const num = options.getInteger('number') - 1;

            if (!ruleData || !ruleData.rules[num]) {
                return interaction.editReply(language(guild, 'RULES_ERROR_NOT_FOUND'));
            }

            ruleData.rules.splice(num, 1);
            await ruleData.save();

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(language(guild, 'RULES_REMOVED_TITLE'))
                .setDescription(`🗑 Paragraph §${num + 1} ${language(guild, 'RULES_REMOVED_DESC')}`);
            
            return interaction.editReply({ embeds: [embed] });
        }

        if (subcommand === 'list') {
            const embed = new EmbedBuilder()
                .setTitle(`📜 ${language(guild, 'RULES_LIST_TITLE')} ${guild.name}`)
                .setColor('Blue')
                .setTimestamp();

            if (!ruleData || ruleData.rules.length === 0) {
                embed.setDescription(language(guild, 'RULES_LIST_EMPTY'));
            } else {
                ruleData.rules.forEach((rule, index) => {
                    embed.addFields({ 
                        name: `§${index + 1} ${rule.title}`, 
                        value: rule.description 
                    });
                });
            }

            await interaction.editReply({ embeds: [embed] });
        }
    },
};