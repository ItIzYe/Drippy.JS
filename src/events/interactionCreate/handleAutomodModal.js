const { EmbedBuilder, MessageFlags } = require('discord.js');
const AutomodConfig = require('../../models/Automod');

module.exports = async (client, interaction) => {
    // Falls der Handler die Argumente vertauscht hat (Sicherheitsnetz)
    const it = interaction?.isModalSubmit ? interaction : client;

    if (!it.isModalSubmit || !it.isModalSubmit()) return;

    // PRÜFUNG: Stimmt die ID wirklich überein?
    if (it.customId === 'automod_add_word') {
        
        // 1. Sofort "Denken"-Status senden (Verhindert "Etwas ist schiefgelaufen")
        // Das gibt uns 15 Minuten Zeit statt 3 Sekunden
        await it.deferReply({ Flags: [MessageFlags.Ephemeral] });

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

            // 3. Antwort senden (editReply statt reply, da wir oben deferReply genutzt haben)
            await it.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('DATABASE ERROR:', error);
            await it.editReply({ content: '❌ Datenbankfehler beim Speichern.' });
        }
    }
};