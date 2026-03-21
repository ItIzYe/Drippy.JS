const faqAdminHandler = require('../../utils/faqAdminHandler');

module.exports = async (client, interaction) => {

    if (interaction.isButton()) {
        if (interaction.customId.startsWith('faq_')) {
            return await faqAdminHandler(client, interaction);
        }
    }


    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('faq_modal')) {
            return await faqAdminHandler(client, interaction);
        }
    }


    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'faq_delete_confirm') {
            return await faqAdminHandler(client, interaction);
        }
    }
};