const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        
        const isProd = process.env.APP_ENV === 'prod';

        const testServerCommands = await getApplicationCommands(
            client,
            testServer
        );

        const globalCommands = await getApplicationCommands(
            client
        );

        for (const localCommand of localCommands) {
            const { name, description, options, testOnly, deleted, description_localizations } = localCommand;

            let targetApplicationCommands;

            if (testOnly) {
                targetApplicationCommands = testServerCommands;
            } else {
                targetApplicationCommands = isProd ? globalCommands : testServerCommands;
            }

            const existingCommand = await targetApplicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if (deleted) {
                    await targetApplicationCommands.delete(existingCommand.id);
                    console.log(`🗑 Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await targetApplicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                        description_localizations: localCommand.description_localizations || null,
                        name_localizations: localCommand.name_localizations || null,
                    });

                    console.log(`🔁 Edited command "${name}".`);
                }
            } else {
                if (deleted) {
                    console.log(`⏩ Skipping registering command "${name}" as it's set to delete.`);
                    continue;
                }

                await targetApplicationCommands.create({
                    name,
                    description,
                    options,
                    description_localizations: localCommand.description_localizations || null,
                    name_localizations: localCommand.name_localizations || null,
                });

                const targetType = testOnly ? "TEST-SERVER" : (isProd ? "GLOBAL" : "DEV-SERVER");
                console.log(`👍 Registered command "${name}" on ${targetType}.`);
            }
        }
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
}