const { 
    Client, 
    Interaction, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');
const mongoose = require('mongoose');

// Mongoose Model
const PlayerSchema = new mongoose.Schema({
    userId: String,
    points: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    league: { type: String, default: 'Beginner' },
});
const Player = mongoose.model('Player', PlayerSchema);

module.exports = {
    name: 'guessthenumber',
    description: 'Starte ein interaktives Guess-The-Number Spiel!',
    devOnly: false,
    testOnly: false,
    options: [],
    callback: async (client, interaction) => {
        const { user, channel } = interaction;

        // Stelle sicher, dass der Spieler in der DB existiert
        let player = await Player.findOne({ userId: user.id });
        if (!player) player = await Player.create({ userId: user.id });

        const mainMenuEmbed = new EmbedBuilder()
            .setTitle('Guess The Number - Hauptmenü')
            .setColor('#fcbe35')
            .setDescription('Wähle einen Spielmodus oder schaue deinen Highscore/Leaderboard an.');

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('normal_match')
                .setLabel('Normal Match')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('arcade')
                .setLabel('Arcade')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('highscore')
                .setLabel('Highscore')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('leaderboard')
                .setLabel('Leaderboard')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [mainMenuEmbed], components: [buttons] });

        const filter = i => i.user.id === user.id;
        const collector = channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.customId === 'highscore') {
                const hsEmbed = new EmbedBuilder()
                    .setTitle(`${user.username}'s Highscore`)
                    .setColor('#fcbe35')
                    .addFields(
                        { name: 'Punkte', value: `${player.points}`, inline: true },
                        { name: 'Liga', value: `${player.league}`, inline: true },
                        { name: 'XP', value: `${player.xp}`, inline: true }
                    );
                await i.editReply({ embeds: [hsEmbed], components: [buttons] });
            }

            if (i.customId === 'leaderboard') {
                const topPlayers = await Player.find().sort({ points: -1 }).limit(10);
                if (!topPlayers || topPlayers.length === 0) {
                    await i.editReply({ content: 'Noch keine Spieler gefunden!', components: [buttons] });
                    return;
                }

                let leaderboardText = '';
                for (let idx = 0; idx < topPlayers.length; idx++) {
                    const p = topPlayers[idx];
                    const member = await interaction.guild.members.fetch(p.userId).catch(() => null);
                    const name = member ? member.user.username : `User ID: ${p.userId}`;
                    leaderboardText += `**${idx + 1}. ${name}** - Punkte: ${p.points}, Liga: ${p.league}\n`;
                }

                const lbEmbed = new EmbedBuilder()
                    .setTitle('🌟 Guess-The-Number Leaderboard')
                    .setDescription(leaderboardText)
                    .setColor('#fcbe35')
                    .setFooter({ text: 'Top Spieler weltweit' });

                await i.editReply({ embeds: [lbEmbed], components: [buttons] });
            }

            if (i.customId === 'normal_match') {
                collector.stop();
                startNormalMatch(channel, player, user);
            }

            if (i.customId === 'arcade') {
                collector.stop();
                startArcade(channel, player, user);
            }
        });
    },
};

// --- Spielmodi Funktionen ---
async function startNormalMatch(channel, player, user) {
    let rounds = 10;
    let userPoints = 0;
    let botPoints = 0;

    for (let r = 1; r <= rounds; r++) {
        const num1 = Math.floor(Math.random() * 100) + 1;
        const num2 = Math.floor(Math.random() * 100) + 1;
        const min = Math.min(num1, num2);
        const max = Math.max(num1, num2);

        await channel.send(`${user}, Runde ${r}: Wähle eine Zahl zwischen ${min} und ${max}.`);

        const filter = m => m.author.id === user.id && !isNaN(m.content) && parseInt(m.content) >= min && parseInt(m.content) <= max;
        const collected = await channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }).catch(() => null);

        if (!collected || collected.size === 0) {
            await channel.send('Zeit abgelaufen! Runde wird übersprungen.');
            continue;
        }

        const userNum = parseInt(collected.first().content);
        const botNum = Math.floor(Math.random() * (max - min + 1)) + min;

        await channel.send(`Bot hat ${botNum} gewählt.`);

        if (userNum > botNum) userPoints += 10;
        else if (botNum > userNum) botPoints += 10;
        else { userPoints += 5; botPoints += 5; }

        await channel.send(`Stand nach Runde ${r}: ${userPoints} - ${botPoints}`);
    }

    await finalizeGame(channel, player, user, userPoints);
}

async function startArcade(channel, player, user) {
    let lives = 3;
    let points = 0;

    while (lives > 0) {
        const num1 = Math.floor(Math.random() * 999) + 1;
        const num2 = Math.floor(Math.random() * 999) + 1;
        const min = Math.min(num1, num2);
        const max = Math.max(num1, num2);

        await channel.send(`${user}, wähle eine Zahl zwischen ${min} und ${max}. Du hast ${lives} Leben.`);

        const filter = m => m.author.id === user.id && !isNaN(m.content) && parseInt(m.content) >= min && parseInt(m.content) <= max;
        const collected = await channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }).catch(() => null);

        if (!collected || collected.size === 0) {
            await channel.send('Zeit abgelaufen! Du verlierst ein Leben.');
            lives--;
            continue;
        }

        const userNum = parseInt(collected.first().content);
        const botNum = Math.floor(Math.random() * (max - min + 1)) + min;

        await channel.send(`Bot hat ${botNum} gewählt.`);

        if (userNum > botNum) points += 10;
        else if (botNum > userNum) lives--;

        await channel.send(`Aktueller Punktestand: ${points}, Leben: ${lives}`);
    }

    await finalizeGame(channel, player, user, points);
}

// --- Spiel beenden und Highscore aktualisieren ---
async function finalizeGame(channel, player, user, points) {
    // XP und Liga berechnen
    player.xp += points;
    player.points = Math.max(player.points, points);

    if (player.points >= 10000) player.league = 'Obsidian';
    else if (player.points >= 5000) player.league = 'Diamond';
    else if (player.points >= 1000) player.league = 'Gold';
    else if (player.points >= 500) player.league = 'Silver';
    else if (player.points >= 100) player.league = 'Rookie';
    else player.league = 'Beginner';

    await player.save();

    const embed = new EmbedBuilder()
        .setTitle(`Spiel beendet!`)
        .setColor('#fcbe35')
        .setDescription(`${user.username}, du hast ${points} Punkte erreicht und bist nun in der Liga **${player.league}**.`);

    await channel.send({ embeds: [embed] });
}
