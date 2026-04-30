const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ChannelSelectMenuBuilder, 
    ChannelType, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle ,
    MessageFlags
} = require('discord.js');
const AutomodConfig = require('../../models/Automod');
const language = require("../../handlers/languages");

module.exports = async (client, interaction) => {
    // 1. Nur Buttons und Select-Menus verarbeiten
    if (!interaction.isButton() && !interaction.isChannelSelectMenu()) return;

    const { customId, guildId, guild } = interaction;

    // Nur auf unsere Automod-Interaktionen reagieren
    if (!customId.startsWith('automod_')) return;

    // Datenbank-Eintrag laden oder erstellen
    let config = await AutomodConfig.findOne({ guildId });
    if (!config) {
        config = await AutomodConfig.create({ 
            guildId, 
            customBannedWords: [], 
            channelSettings: [] 
        });
    }

    try {
        // --- A: DASHBOARD TOGGLE (AN/AUS) ---
        if (customId === 'automod_toggle') {
            // 1. Status sofort im Speicher umkehren
    config.enabled = !config.enabled;

    // 2. Speichern im Hintergrund (mit await, um sicherzugehen)
    await config.save();

    // 3. JETZT das Embed bauen – wir nutzen den aktuellsten Wert aus 'config.enabled'
    const isEnabled = config.enabled;

            const updatedEmbed = new EmbedBuilder()
                .setColor(config.enabled ? 0x00FF00 : 0xFF0000)
                .setTitle(`🛡️ ${language(guild, 'AUTOMOD_DASHBOARD_TITLE')}`)
                .setDescription(language(guild, 'AUTOMOD_DASHBOARD_DESC'))
                .setFields(
                    { name: 'Status', value: config.enabled ? '🟢 Aktiv' : '🔴 Deaktiviert', inline: true },
                    { name: 'Wörter', value: `\`${config.customBannedWords?.length || 0}\``, inline: true },
                    { name: 'Konfiguration', value: `\`${config.channelSettings?.length || 0}\` Kanäle angepasst`, inline: true }
                );

            const updatedRow1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('automod_toggle')
                    .setLabel(config.enabled ? 'Deaktivieren' : 'Aktivieren')
                    .setStyle(config.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('automod_add_word')
                    .setLabel('Wort hinzufügen')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('automod_channel_config_start')
                    .setLabel('Kanäle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⚙️')
            );

            const updatedRow2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('automod_show_words')
                    .setLabel('Liste zeigen')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('automod_list_channels')
                    .setLabel('Kanäle anzeigen')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
            );

            return await interaction.update({ embeds: [updatedEmbed], components: [updatedRow1, updatedRow2] });
        }

        // --- B: WORTLISTE ANZEIGEN ---
        if (customId === 'automod_show_words') {
            const words = config.customBannedWords || [];
            if (words.length === 0) {
                return await interaction.reply({ content: "Die Blacklist ist aktuell leer."});
            }

            const wordList = words.map(w => `• ${w}`).join('\n').slice(0, 2000);
            const listEmbed = new EmbedBuilder()
                .setTitle('🚫 Blacklist Wörter')
                .setDescription(wordList)
                .setColor(0xFFFF00);

            return await interaction.reply({ embeds: [listEmbed]});
        }

        // --- C: KANAL-KONFIGURATION START (MENÜ SENDEN) ---
        if (customId === 'automod_channel_config_start') {
            const channelSelect = new ChannelSelectMenuBuilder()
                .setCustomId('automod_select_channel')
                .setPlaceholder('Wähle einen Kanal...')
                .setChannelTypes(ChannelType.GuildText);

            return await interaction.reply({
                content: 'Wähle den Kanal aus, den du anpassen möchtest:',
                components: [new ActionRowBuilder().addComponents(channelSelect)],
                Flags: [MessageFlags.Ephemeral]
            });
        }

        // --- D: KANAL GEWÄHLT ODER KANAL-TOGGLE GEKLICKT (AUTO-UPDATE) ---
        if (customId === 'automod_select_channel' || customId.startsWith('automod_ch_')) {
            let channelId;

            // Falls ein Toggle-Button geklickt wurde
            if (customId.startsWith('automod_ch_')) {
                const parts = customId.split('_');
                const type = parts[2]; // 'link' oder 'image'
                channelId = parts[3];

                let channelEntry = config.channelSettings.find(c => c.channelId === channelId);
                if (!channelEntry) {
                    channelEntry = { channelId, allowLinks: false, allowImages: false };
                    config.channelSettings.push(channelEntry);
                }

                if (type === 'link') channelEntry.allowLinks = !channelEntry.allowLinks;
                if (type === 'image') channelEntry.allowImages = !channelEntry.allowImages;

                config.markModified('channelSettings');
                await config.save();
            } else {
                // Falls das Menü genutzt wurde
                channelId = interaction.values[0];
            }

            // Neues Embed für das Kanal-Update bauen
            const channelEntry = config.channelSettings.find(c => c.channelId === channelId) || { allowLinks: false, allowImages: false };

            const channelEmbed = new EmbedBuilder()
                .setTitle(`⚙️ Einstellungen für <#${channelId}>`)
                .setColor(0x3498DB)
                .addFields(
                    { name: '🔗 Links', value: channelEntry.allowLinks ? '✅ Erlaubt' : '❌ Verboten', inline: true },
                    { name: '🖼️ Bilder', value: channelEntry.allowImages ? '✅ Erlaubt' : '❌ Verboten', inline: true }
                );

            const channelButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`automod_ch_link_${channelId}`)
                    .setLabel(channelEntry.allowLinks ? 'Links verbieten' : 'Links erlauben')
                    .setStyle(channelEntry.allowLinks ? ButtonStyle.Danger : ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`automod_ch_image_${channelId}`)
                    .setLabel(channelEntry.allowImages ? 'Bilder verbieten' : 'Bilder erlauben')
                    .setStyle(channelEntry.allowImages ? ButtonStyle.Danger : ButtonStyle.Success)
            );

            return await interaction.update({
                content: '',
                embeds: [channelEmbed],
                components: [channelButtons]
            });
        }

        // --- E: WORT HINZUFÜGEN (MODAL ÖFFNEN) ---
        if (customId === 'automod_add_word') {
            const modal = new ModalBuilder()
                .setCustomId('automod_add_word')
                .setTitle('Wort hinzufügen');

            const wordInput = new TextInputBuilder()
                .setCustomId('word_input')
                .setLabel("Welches Wort soll blockiert werden?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(wordInput));
            return await interaction.showModal(modal);
        }

    } catch (error) {
        console.error("Fehler im Automod-Button-Handler:", error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Ein Fehler ist aufgetreten.'});
        }
    }

    // --- LOGIK: KONFIGURIERTE KANÄLE AUFLISTEN ---
if (customId === 'automod_list_channels') {
    const channelConfigs = config.channelSettings || [];

    if (channelConfigs.length === 0) {
        return await interaction.reply({ 
            content: 'Es wurden bisher keine speziellen Kanal-Regeln festgelegt. Überall gelten die Standard-Filter.'
        });
    }

    const listEmbed = new EmbedBuilder()
        .setTitle('📋 Kanal-Konfigurationen')
        .setColor(0x3498DB)
        .setDescription('Hier siehst du alle Kanäle mit speziellen Berechtigungen:')
        .setTimestamp();

    // Wir bauen die Liste zusammen
    let descriptionText = "";
    channelConfigs.forEach(conf => {
        descriptionText += `<#${conf.channelId}>:\n` +
                           `> 🔗 Links: ${conf.allowLinks ? '✅' : '❌'}\n` +
                           `> 🖼️ Bilder: ${conf.allowImages ? '✅' : '❌'}\n\n`;
    });

    listEmbed.setDescription(descriptionText.slice(0, 4096)); // Schutz vor zu langem Text

    return await interaction.reply({
        embeds: [listEmbed]
    });
}
};