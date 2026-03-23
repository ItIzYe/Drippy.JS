const { PermissionFlagsBits } = require('discord.js');
const faqAdminHandler = require('../../utils/faqAdminHandler');

module.exports = {
    name: 'faq-admin',
    description: 'Öffnet das Panel zur Verwaltung der FAQs.',
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    testOnly: true,

    callback: async (client, interaction) => {
        await faqAdminHandler(client, interaction);
    }
};