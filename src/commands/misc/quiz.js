const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const mongoose = require('mongoose');

// Highscore Schema
const highscoreSchema = new mongoose.Schema({
    userId: String,
    username: String,
    score: Number
});
const Highscore = mongoose.models.Highscore || mongoose.model('Highscore', highscoreSchema);

module.exports = {
    name: 'quiz',
    description: 'Startet das Quiz',
    callback: async (interaction) => {
        let score = 0;
        let round = 1;
        const qa = [{
    question: 'Was bedeutet der Name der russischen Raumstation `Mir` ins deutsche übersetzt?',
    answers: ['Frieden', 'Sieg', 'Raumstation'],
    correct: 'A'
  },
  {
    question: 'Wann hat Venom Aimz seinen Yoututbe Kanal gegründet?',
    answers: ['03.03.2020', '30.02.2020', '31.06.2020'],
    correct: 'A'
  },
  {
    question: 'In welcher Sprache wurde ich geschrieben?',
    answers: ['JavaScript', 'Java', 'Chinesisch'],
    correct: 'A'
  },
  {
    question: 'Von wem wurde der Song Mulberry Street geschrieben?',
    answers: ['Twenty one Pilots', 'Imagine Dragons', 'Pink Floyd'],
    correct: 'A'
  },
  {
    question: 'Welches sind die drei großen monotheistischen Weltreligionen?',
    answers: ['Judentum, Islam, Christentum', 'Judentum, Buddismus, Christentum', 'Islam, Hinduismus, Atheismus'],
    correct: 'A'
  },
  {
    question: 'Das flächenmäßig kleinste Bundesland heißt?',
    answers: ['Berlin', 'Bremen', 'Saarland'],
    correct: 'B'
  },
  {
    question: 'Was ist die "Goldene Himbeere"?',
    answers: ['Ein Preis für die schlechteste Leistung innerhalb eines Filmjahres', 'Eine Nachspeise aus Russland', 'Das Symbol einer Sekte'],
    correct: 'A'
  },
  {
    question: 'Einen Feinschmecker nennt man auch?',
    answers: ['Gourmet', 'Gourmed', 'Leckermäulchen'],
    correct: 'A'
  },
  {
    question: 'Folgt man dem Äquator um die Welt, legt man wie viele Kilometer zurück?',
    answers: ['Rund 40.070 km', 'Rund 30.070 km', 'Rund 80.070 km'],
    correct: 'A'
  },
  {
    question: 'Mit welcher Tiergruppe sind die Dinosaurier am engsten verwandt?',
    answers: ['Vögeln', 'Eidechsen', 'Alligatoren'],
    correct: 'A'
  },
  {
    question: 'Welches Metall leitet Wärme am besten?',
    answers: ['Silber', 'Kupfer', 'Aluminium'],
    correct: 'A'
  },
  {
    question: 'Wie lautet die Hauptstadt von Frankreich?',
    answers: ['Paris', 'Amsterdam', 'Oslo'],
    correct: 'A'
  },
  {
    question: 'Wie lautet die Hauptstadt von Bayern?',
    answers: ['München', 'Dortmund', 'Stuttgart'],
    correct: 'A'
  },
  {
    question: 'Wann endete der 2. Weltkrieg?',
    answers: ['1945', '1950', '1939'],
    correct: 'A'
  },
  {
    question: 'Wie lautet der zweite Planet in unserem Sonnensystem?',
    answers: ['Venus', 'Jupiter', 'Venera'],
    correct: 'A'
  },
  {
    question: 'Welches dieser Tiere hält keinen Winterschlaf?',
    answers: ['Eichhörnchen', 'Fledermaus', 'Siebenschläfer'],
    correct: 'A'
  },
  {
    question: 'In welcher Einheit wird der elektrische Widerstand gemessen?',
    answers: ['Ohm', 'Volt', 'Ampere'],
    correct: 'A'
  },
  {
    question: 'Was ist ein Oxymoron?',
    answers: ['Ein innerer Widerspruch', 'Ein Versfuß', 'Eine Frageform'],
    correct: 'A'
  },
  {
    question: 'Wo fanden die Olympischen Spiele 1996 statt?',
    answers: ['Atlanta', 'Turin', 'Los Angeles'],
    correct: 'A'
  },
  {
    question: 'Wer gilt als Verfasser der amerikanischen Unabhängigkeitserklärung?',
    answers: ['Thomas Jefferson', 'Benjamin Franklin', 'John Adams'],
    correct: 'A'
  },
  {
    question: 'Wie viele Planeten hat unser Sonnensystem?',
    answers: ['8', '9', '11'],
    correct: 'A'
  },
  {
    question: 'Welches ist das höchste Amt in Deutschland?',
    answers: ['Bundespräsident', 'Bundeskanzler', 'Bundestagspräsident'],
    correct: 'A'
  },
  {
    question: 'Wie heißt die Schicht der Atmosphäre, die der Erde am nächsten ist?',
    answers: ['Troposphäre', 'Stratosphäre', 'Thermosphäre'],
    correct: 'A'
  },
  {
    question: 'Welcher Ozean liegt zwischen Europa und Amerika?',
    answers: ['Atlantischer Ozean', 'Indischer Ozean', 'Karibisches Meer'],
    correct: 'A'
  },
  {
    question: 'Welches Bundesland ist flächenmäßig das größte?',
    answers: ['Bayern', 'Baden-Würtemberg', 'Nordrhein-Westfalen'],
    correct: 'A'
  },
  {
    question: 'Wie beginnt die Kreiszahl Pi (π)?',
    answers: ['3,1415', '2,8485', '4,646'],
    correct: 'A'
  },
  {
    question: 'Aus wessen Feder stammt „Krieg und Frieden“?',
    answers: ['Leo Tolstoi', 'Fjodor Dostojewski', 'Anton Tschechow'],
    correct: 'A'
  },
  {
    question: 'Wie viele Atemzüge nimmt der menschliche Körper täglich?',
    answers: ['20.000 täglich', '10.000 täglich', '30.000 täglich'],
    correct: 'A'
  },
  {
    question: 'Wie hoch hängt ein Basketball-Korb?',
    answers: ['3.05 Meter', '2.90 Meter', '3.50 Meter'],
    correct: 'A'
  },
  {
    question: 'Aus wie vielen Kräutern ist Jägermeister gemacht?',
    answers: ['56', '26', '6'],
    correct: 'A'
  },
  {
    question: 'Wie viel Geld warfen Rom-Besucher im Jahr 2016 in den Trevi-Brunnen?',
    answers: ['1.4 Mio. Euro', '1,6 Mio. Euro', '500.000 Euro'],
    correct: 'A'
  },
  {
    question: 'In welchem Land wohnen die meisten Menschen?',
    answers: ['Indien/China', 'USA', 'Kanada'],
    correct: 'A'
  },
  {
    question: 'Die Freiheitsstatue in New York war ein Geschenk von:',
    answers: ['Frankreich', 'Großbritannien', 'Kanada'],
    correct: 'A'
  },
  {
    question: 'Von wem stammt das Zitat: „Dies ist ein kleiner Schritt für einen Menschen...“?',
    answers: ['Neil Armstrong', 'Elon Musk', 'Galileo Galilei'],
    correct: 'A'
  },
  {
    question: 'Wie wird die Zahl unter dem Bruchstrich bezeichnet?',
    answers: ['Nenner', 'Zähler', 'Teiler'],
    correct: 'A'
  },
  {
    question: 'Welcher ist der längste innerdeutsche Fluss?',
    answers: ['Rhein', 'Weser', 'Donau'],
    correct: 'A'
  },
  {
    question: 'Lautstärke misst man in?',
    answers: ['Dezibel', 'Liter', 'Gramm'],
    correct: 'A'
  },{
    question: 'Wer hat den Soundtrack für `Django Unchained` geschrieben?',
    answers: ['John Williams', 'Ennio Morricone', 'Hans Zimmer'],
    correct: 'B'
  },
  {
    question: 'Welches ist der höchste Berg auf unserem Heimatplaneten?',
    answers: ['Himalaya', 'Mount Everest', 'Olympus Mons'],
    correct: 'B'
  },
  {
    question: 'Wann fing der 1. Weltkrieg an?',
    answers: ['1795', '1914', '1980'],
    correct: 'B'
  },
  {
    question: 'Wieviele kcal hat ein Bic Mac?',
    answers: ['200kcal', '503kcal', '800kcal'],
    correct: 'B'
  },
  {
    question: 'Wieviele Saiten hat ein Klavier?',
    answers: ['90', '88', '70'],
    correct: 'B'
  },
  {
    question: 'Was ist AE (AU)?',
    answers: ['eine Variabel', 'Astrononmische Einheit', 'Gelbanteil in Licht'],
    correct: 'B'
  },
  {
    question: 'Vervollständige den Namen der Serie: How I...',
    answers: ['cooked a Chicken', 'met your Mother', 'fought against Darth Vader'],
    correct: 'B'
  },
  {
    question: 'Übersetze `10001` (Binär zu Dezimal):',
    answers: ['Hallo', '17', 'Stift'],
    correct: 'B'
  },
  {
    question: 'In welchem Jahr fand der sogenannte "Prager Frühling" statt?',
    answers: ['1966', '1968', '1972'],
    correct: 'B'
  },
  {
    question: 'Wann ist Powerkatze dem Server gejoint?',
    answers: ['19th Jun 20', '30th Feb 21', '17 Dec 19'],
    correct: 'C'
  },
  {
    question: 'Das flächenmäßig kleinste Bundesland heißt?',
    answers: ['Berlin', 'Bremen', 'Saarland'],
    correct: 'B'
  },
  {
    question: 'Was bedeutet das lateinische “carpe diem”?',
    answers: ['Genieße das Leben', 'Nutze den Tag', 'Dein Tag wird toll werden'],
    correct: 'B'
  },
  {
    question: 'Welcher deutsche Herrscher trug den Beinamen “der Große”?',
    answers: ['Friedrich der I. von Preußen', 'Friedrich II. von Preußen', 'Friedrich der III. von Österreich'],
    correct: 'B'
  },
  {
    question: 'Welcher Pilz ist einer der giftigsten der Welt?',
    answers: ['Der Fliegenpilz', 'Der Grüne Knollenblätterpilz', 'Der Satansröhrling'],
    correct: 'B'
  },
  {
    question: 'Welcher Schauspieler hat nicht in einem James Bond-Film mitgespielt?',
    answers: ['Timothy Dalton', 'Leonardo DiCaprio', 'Javier Bardem'],
    correct: 'B'
  },
  {
    question: 'Was meinen Weinkenner, wenn sie das Wort “rassig” verwenden?',
    answers: ['alkohol- und körperreiche Weine', 'Weine mit einer ausgeglichenen, aber ausgeprägten Säure', 'Weine, die im Geschmack an frisches Obst erinnern'],
    correct: 'B'
  },
  {
    question: 'Wo herrscht kein Linksverkehr?',
    answers: ['Irland', 'Island', 'Großbritannien'],
    correct: 'B'
  },
  {
    question: 'Wie viele Nieren hat ein Mensch im Normalfall?',
    answers: ['3', '2', '5'],
    correct: 'B'
  },
  {
    question: 'Wie lange geht ein Marathon?',
    answers: ['25 Kilometer', '42,195 Kilometer', '1000 Meter'],
    correct: 'B'
  },
  {
    question: 'In welchem Jahr wurde der Euro als Bargeld eingeführt?',
    answers: ['2000', '2002', '2005'],
    correct: 'B'
  },
  {
    question: 'Welches Vitamin wird mithilfe von Sonnenlicht im Körper gebildet?',
    answers: ['Vitamin E', 'Vitamin D', 'Vitamin A'],
    correct: 'B'
  },
  {
    question: 'In welcher Stadt lebte der Detektiv Sherlock Holmes?',
    answers: ['Köln', 'London', 'Manchester'],
    correct: 'B'
  },
  {
    question: 'Die Zeichentrick-Familie Simpsons lebt in welcher Stadt?',
    answers: ['New York', 'Springfield', 'Minnesota'],
    correct: 'B'
  },
  {
    question: 'Welcher Planet unseres Sonnensystems wird als Roter Planet bezeichnet?',
    answers: ['Jupiter', 'Mars', 'Neptun'],
    correct: 'B'
  },
  {
    question: 'Wie heißt die Hauptstadt der Slowakei?',
    answers: ['Prag', 'Bratislava', 'Ljubljana'],
    correct: 'B'
  },
  {
    question: 'Wie viele Zähne hat ein erwachsener Mensch normalerweise?',
    answers: ['26', '32', '36'],
    correct: 'B'
  },
  {
    question: 'Wie heißt die Hauptstadt von Thüringen?',
    answers: ['Magdeburg', 'Erfurt', 'Dresden'],
    correct: 'B'
  },
  {
    question: 'Wofür steht das „L“ im Sender RTL?',
    answers: ['London', 'Luxembourg', 'Liechtenstein'],
    correct: 'B'
  },
  {
    question: 'Was soll Cäsar gesagt haben, als er den Rubikon überquerte?',
    answers: ['veni, vidi, vici', 'alea iacta est', 'et tu, brute'],
    correct: 'B'
  },
  {
    question: 'Wie viele Oscars gewann der Film „Titanic“?',
    answers: ['10', '11', '13'],
    correct: 'B'
  },
  {
    question: 'Wie lautet das chemische Symbol für Blei?',
    answers: ['Bl', 'Pb', 'Be'],
    correct: 'B'
  },
  {
    question: 'Welchen Namen trägt die Universität Frankfurt am Main?',
    answers: ['Bertolt Brecht', 'Johann Wolfgang von Goethe', 'Heinrich Heine'],
    correct: 'B'
  },
  {
    question: 'An welchem Datum fiel die Berliner Mauer?',
    answers: ['3. Oktober 1990', '9. November 1989', '8. Oktober 1989'],
    correct: 'B'
  },
  {
    question: 'In welchem Jahr ist die Titanic gesunken?',
    answers: ['1920', '1912', '1908'],
    correct: 'B'
  },
  {
    question: 'Was ist die Hauptstadt von Portugal?',
    answers: ['Porto', 'Lissabon', 'Lago'],
    correct: 'B'
  },
  {
    question: 'Was ist das chemische Symbol für Silber?',
    answers: ['Au', 'Ag', 'Af'],
    correct: 'B'
  }]; // leer lassen

        const current = qa[0] || {
            question: 'Keine Fragen vorhanden',
            answers: ['A: -', 'B: -', 'C: -'],
            correct: 'A'
        };

        const embed = new EmbedBuilder()
            .setTitle(`Runde ${round}`)
            .setDescription(current.question)
            .addFields(
                { name: 'Antwortmöglichkeiten', value: current.answers.join('\n') },
                { name: 'Score', value: `${score}`, inline: true }
            )
            .setColor('#fcbe35');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('answer_A').setLabel(current.answers[0]).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('answer_B').setLabel(current.answers[1]).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('answer_C').setLabel(current.answers[2]).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('quit').setLabel('Spiel beenden').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('leaderboard').setLabel('Highscore').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: "Das ist nicht dein Quiz!", ephemeral: true });
            }

            if (i.customId.startsWith('answer_')) {
                const answer = i.customId.split('_')[1];
                if (answer === current.correct) score++;
                round++;

                // Aktualisiere Embed
                const newEmbed = EmbedBuilder.from(embed)
                    .setTitle(`Runde ${round}`)
                    .setFields(
                        { name: 'Antwortmöglichkeiten', value: current.answers.join('\n') },
                        { name: 'Score', value: `${score}`, inline: true }
                    );
                await i.update({ embeds: [newEmbed], components: [row] });
            }

            if (i.customId === 'quit') {
                await i.update({ content: `Quiz beendet. Dein Score: ${score}`, embeds: [], components: [] });
                collector.stop();
            }

            if (i.customId === 'leaderboard') {
                // Highscore aus MongoDB abrufen
                const top = await Highscore.find().sort({ score: -1 }).limit(10);
                const leaderboardEmbed = new EmbedBuilder()
                    .setTitle('Leaderboard')
                    .setDescription(top.map((u, idx) => `${idx + 1}. ${u.username}: ${u.score}`).join('\n') || 'Noch keine Einträge')
                    .setColor('#00ff00');
                await i.reply({ embeds: [leaderboardEmbed], ephemeral: true });
            }
        });

        collector.on('end', () => {});
    }
};
