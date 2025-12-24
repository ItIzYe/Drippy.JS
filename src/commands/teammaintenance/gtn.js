const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const User = require("../../models/User");

const leagues = [
    { name: "Beginner", level: 100 },
    { name: "Rookie", level: 500 },
    { name: "Silver", level: 1000 },
    { name: "Gold", level: 5000 },
    { name: "Diamond", level: 10000 },
    { name: "Obsidian", level: 20000 }
];

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Object} 0param
     */
    name: "guessthenumber",
    description: "Spiele GuessTheNumber mit Normal Match oder Arcade!",

    callback: async (client, interaction) => {
        await interaction.deferReply();

        // Buttons für Spielmodi
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("normal")
                .setLabel("Normal Match")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("arcade")
                .setLabel("Arcade")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("highscore")
                .setLabel("Highscore & Liga")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.editReply({ content: "Wähle einen Spielmodus:", components: [buttons] });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on("collect", async i => {
            await i.deferUpdate();

            // Userdaten aus DB holen oder neu erstellen
            let userData = await User.findOne({ userId: i.user.id });
            if (!userData) userData = await User.create({ userId: i.user.id });

            if (i.customId === "highscore") {
                if (!userData.points && !userData.xp) {
                    return i.editReply("Du hast noch keinen Highscore. Spiele zuerst ein Match!");
                }

                const embed = new EmbedBuilder()
                    .setColor("#fcbe35")
                    .setTitle(`${i.user.username} - Highscore & Liga`)
                    .setDescription(`Punkte: ${userData.points}\nXP: ${userData.xp}\nLiga: ${userData.league}\nNoch ${userData.nextLevel - userData.xp} XP bis zur nächsten Liga`);
                return i.editReply({ embeds: [embed], components: [] });
            }

            if (i.customId === "arcade") {
                await arcadeGame(i, userData);
            }

            if (i.customId === "normal") {
                await normalGame(i, userData);
            }

            collector.stop();
        });
    }
};

// Arcade-Spiel
async function arcadeGame(interaction, userData) {
    let lives = 3;
    let points = 0;

    while (lives > 0) {
        const number1 = Math.floor(Math.random() * 999) + 1;
        const number2 = Math.floor(Math.random() * 999) + 1;
        const min = Math.min(number1, number2);
        const max = Math.max(number1, number2);

        await interaction.followUp(`Dein Gegner wählt eine Zahl zwischen **${min}** und **${max}**. Tippe deine Zahl in den Chat.`);

        const filter = m => m.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 20000 }).catch(() => null);

        if (!collected) {
            await interaction.followUp("Zeit abgelaufen!");
            break;
        }

        const guess = parseInt(collected.first().content);
        if (isNaN(guess) || guess < min || guess > max) {
            await interaction.followUp("Ungültige Zahl!");
            continue;
        }

        const botGuess = Math.floor(Math.random() * (max - min + 1)) + min;

        if (guess > botGuess) {
            points += 10;
            await interaction.followUp(`Dein Gegner hat **${botGuess}** gewählt. Du hast gewonnen! +10 Punkte`);
        } else if (guess === botGuess) {
            points += 5;
            await interaction.followUp(`Dein Gegner hat ebenfalls **${botGuess}** gewählt. +5 Punkte`);
        } else {
            lives -= 1;
            await interaction.followUp(`Dein Gegner hat **${botGuess}** gewählt. Du verlierst ein Leben! Leben übrig: ${lives}`);
        }
    }

    await updateUserData(userData, points, interaction, `Arcade beendet! Du hast ${points} Punkte gesammelt.`);
}

// Normal Match
async function normalGame(interaction, userData) {
    let rounds = 10;
    let userPoints = 0;
    let botPoints = 0;

    while (rounds > 0) {
        const number1 = Math.floor(Math.random() * 100) + 1;
        const number2 = Math.floor(Math.random() * 100) + 1;
        const min = Math.min(number1, number2);
        const max = Math.max(number1, number2);

        await interaction.followUp(`Runde ${11 - rounds}: Dein Gegner wählt eine Zahl zwischen **${min}** und **${max}**. Tippe deine Zahl in den Chat.`);

        const filter = m => m.author.id === interaction.user.id;
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 20000 }).catch(() => null);

        if (!collected) {
            await interaction.followUp("Zeit abgelaufen!");
            break;
        }

        const guess = parseInt(collected.first().content);
        if (isNaN(guess) || guess < min || guess > max) {
            await interaction.followUp("Ungültige Zahl!");
            continue;
        }

        const botGuess = Math.floor(Math.random() * (max - min + 1)) + min;

        if (guess > botGuess) userPoints += 10;
        else botPoints += 10;

        await interaction.followUp(`Dein Gegner hat **${botGuess}** gewählt.`);
        rounds--;
    }

    let result = userPoints > botPoints
        ? `Du hast gewonnen! (+${userPoints} Punkte)`
        : `Dein Gegner hat gewonnen! (+${userPoints} Punkte)`;

    await updateUserData(userData, userPoints, interaction, result);
}

// Userdaten aktualisieren
async function updateUserData(userData, pointsGained, interaction, resultText = "") {
    userData.points += pointsGained;
    userData.xp += Math.floor(pointsGained / 2);

    for (let i = leagues.length - 1; i >= 0; i--) {
        if (userData.xp >= leagues[i].level) {
            userData.league = leagues[i].name;
            userData.nextLevel = leagues[i].level;
            break;
        }
    }

    await userData.save();

    const embed = new EmbedBuilder()
        .setColor("#fcbe35")
        .setTitle("GuessTheNumber Ergebnis")
        .setDescription(resultText || `Du hast ${pointsGained} Punkte gewonnen!`)
        .addFields(
            { name: "Punkte", value: `${userData.points}`, inline: true },
            { name: "XP", value: `${userData.xp}`, inline: true },
            { name: "Liga", value: `${userData.league}`, inline: true }
        );

    await interaction.followUp({ embeds: [embed] });
}
