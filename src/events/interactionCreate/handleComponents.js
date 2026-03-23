const faqAdminHandler = require('../../utils/faqAdminHandler');
const ticketHandler = require('../../utils/ticketHandler');
;
module.exports = async (client, interaction) => {

    if (!interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu()) {
        return; 
    }
    console.log(`Button/Component registriert: ${interaction.customId}`);

    const customId = interaction.customId;
    

    


    if (customId.startsWith('faq_')) {
        return await faqAdminHandler(client, interaction);
    }


    if (customId.startsWith('ticket_')) {
        return await ticketHandler(client, interaction);
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



  
