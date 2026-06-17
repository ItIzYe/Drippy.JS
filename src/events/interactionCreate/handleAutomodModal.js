const { EmbedBuilder, MessageFlags } = require('discord.js');
const AutomodConfig = require('../../models/Automod');

module.exports = async (client, interaction) => {
    // Falls der Handler die Argumente vertauscht hat (Sicherheitsnetz)
    const it = interaction?.isModalSubmit ? interaction : client;

    if (!it.isModalSubmit || !it.isModalSubmit()) return;

    // --- CASE A: SCHWARZE LISTE (WORT VERBIETEN) ---
    if (it.customId === 'automod_add_word') {
        
        // 1. Sofort "Denken"-Status senden (Verhindert "Etwas ist schiefgelaufen")
        await it.deferReply({ flags: [MessageFlags.Ephemeral] });

        const word = it.fields.getTextInputValue('word_input')?.trim().toLowerCase();
        
        if (!word) {
            return await it.editReply({ content: '❌ Kein Wort angegeben.' });
        }

        try {
            // 2. Datenbank-Operation
            await AutomodConfig.findOneAndUpdate(
                { guildId: it.guildId },
                { $addToSet: { customBannedWords: word } },
                { upsert: true }
            );

            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Wort hinzugefügt')
                .setDescription(`Das Wort **${word}** wurde erfolgreich in die Blacklist aufgenommen.`)
                .setColor(0x2ecc71);

            // 3. Antwort senden
            await it.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('DATABASE ERROR:', error);
            await it.editReply({ content: '❌ Datenbankfehler beim Speichern.' });
        }
    }

    // --- CASE B: WEISSE LISTE (WORT ERLAUBEN / WHITELIST) ---
    // HIER war der Fehler: Der Handler wusste nicht, was er mit dieser ID tun soll!
    else if (it.customId === 'automod_whitelist_modal') {
        
        // 1. Sofort "Denken"-Status senden
        await it.deferReply({ flags: [MessageFlags.Ephemeral] });

        const word = it.fields.getTextInputValue('whitelist_word_input')?.trim().toLowerCase();
        
        if (!word) {
            return await it.editReply({ content: '❌ Kein Wort angegeben.' });
        }

        try {
            // 2. Datenbank-Operation mit $addToSet (verhindert Duplikate)
            await AutomodConfig.findOneAndUpdate(
                { guildId: it.guildId },
                { $addToSet: { whitelistedWords: word } },
                { upsert: true }
            );

            const successEmbed = new EmbedBuilder()
                .setTitle('🏳️ Wort gewhitelistet')
                .setDescription(`Das Wort **${word}** wurde erfolgreich in die Whitelist aufgenommen und wird vom Wort-Filter ignoriert.`)
                .setColor(0x3498DB);

            // 3. Antwort senden
            await it.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('DATABASE ERROR:', error);
            await it.editReply({ content: '❌ Datenbankfehler beim Speichern der Whitelist.' });
        }
    }
};