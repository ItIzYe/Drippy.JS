const { EmbedBuilder, MessageFlags } = require('discord.js');
const AutomodConfig = require('../../models/Automod');

module.exports = async (client, interaction) => {
    const it = interaction?.isModalSubmit ? interaction : client;

    if (!it.isModalSubmit || !it.isModalSubmit()) return;

    if (it.customId === 'automod_add_word') {
        
        await it.deferReply({ flags: [MessageFlags.Ephemeral] });

        const word = it.fields.getTextInputValue('word_input')?.trim().toLowerCase();
        
        if (!word) {
            return await it.editReply({ content: '❌ Kein Wort angegeben.' });
        }

        try {
            await AutomodConfig.findOneAndUpdate(
                { guildId: it.guildId },
                { $addToSet: { customBannedWords: word } },
                { upsert: true }
            );

            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Wort hinzugefügt')
                .setDescription(`Das Wort **${word}** wurde erfolgreich in die Blacklist aufgenommen.`)
                .setColor(0x2ecc71);

            await it.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('DATABASE ERROR:', error);
            await it.editReply({ content: '❌ Datenbankfehler beim Speichern.' });
        }
    }

    else if (it.customId === 'automod_whitelist_modal') {
        
        await it.deferReply({ flags: [MessageFlags.Ephemeral] });

        const word = it.fields.getTextInputValue('whitelist_word_input')?.trim().toLowerCase();
        
        if (!word) {
            return await it.editReply({ content: '❌ Kein Wort angegeben.' });
        }

        try {
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